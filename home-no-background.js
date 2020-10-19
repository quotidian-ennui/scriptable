// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: home;
// Based on https://gist.github.com/rudotriton/b51d227c3d1d9cb497829ae45583224f
// But I don't need the month calender; so I switched it for the Day + Battery.
const debug=false;
const today = new Date();
const textColor = "#ffffff";
const opacity = 0.7;

if (config.runsInWidget) {
  let widget = await createWidget();
  Script.setWidget(widget);
  Script.complete();
} else if (debug) {
  Script.complete();
  let widget = await createWidget();
  await widget.presentMedium();
} else {
  const appleDate = new Date("2001/01/01");
  const timestamp = (new Date().getTime() - appleDate.getTime()) / 1000;
  console.log(timestamp);
  const callback = new CallbackURL("calshow:" + timestamp);
  callback.open();
  Script.complete();
}

//Battery Render
function getBatteryLevel() {
  const batteryLevel = Device.batteryLevel()
  const batteryAscii = Math.round(batteryLevel * 100);
  console.log("Battery is " + batteryAscii + "%");
  return batteryAscii + "%";
}

async function createWidget() {
  let widget = new ListWidget();
  widget.setPadding(16, 16, 16, 16);

  // layout horizontally
  const globalStack = widget.addStack();
  await buildBaseView(globalStack);
  globalStack.addSpacer();
  await buildEventsView(globalStack);
  return widget;
}

// Ends up on the Left.
async function buildBaseView(stack) {
  const baseStack = stack.addStack();
  baseStack.layoutVertically();
  baseStack.addSpacer();
  let dateFormatter = new DateFormatter();
  dateFormatter.dateFormat = "E dd";
  addWidgetTextLine(baseStack, dateFormatter.string(today), {
    font: Font.largeTitle(),
    align: "left",
  });
  baseStack.addSpacer();
  addWidgetTextLine(baseStack, getBatteryLevel(), {
    color: "#00FF00",
    opacity,
    font: Font.largeTitle(),
    align: "left",
  });
  baseStack.addSpacer();
}

// Ends up on the right
async function buildEventsView(stack) {
  const eventsStack = stack.addStack();
  // push event view to the left
  eventsStack.addSpacer();

  eventsStack.layoutVertically();
  // center the whole left part of the widget
  eventsStack.addSpacer();

  const date = new Date();

  // Find future events that aren't all day and aren't canceled
  const events = await CalendarEvent.today([]);
  const futureEvents = [];
  for (const event of events) {
    if (
      event.startDate.getTime() > date.getTime() &&
      !event.isAllDay &&
      !event.title.startsWith("Canceled:")
    ) {
      futureEvents.push(event);
    }
  }

  // if we have events today; else if we don't
  if (futureEvents.length !== 0) {
    // show the next 3 events at most
    const numEvents = futureEvents.length > 3 ? 3 : futureEvents.length;
    for (let i = 0; i < numEvents; i += 1) {
      formatEvent(eventsStack, futureEvents[i], textColor, opacity);
      // don't add a spacer after the last event
      if (i < numEvents - 1) {
        eventsStack.addSpacer(8);
      }
    }
  } else {
    addWidgetTextLine(eventsStack, "No more events today", {
      color: textColor,
      opacity,
      font: Font.regularSystemFont(15),
      align: "left",
    });
  }
  // for centering
  eventsStack.addSpacer();
}

/**
 * Adds a event name along with start and end times to widget stack
 *
 * @param  {WidgetStack} stack - onto which the event is added
 * @param  {CalendarEvent} event - an event to add on the stack
 * @param  {number} opacity - text opacity
 */
function formatEvent(stack, event, color, opacity) {
  addWidgetTextLine(stack, event.title, {
    color,
    font: Font.mediumSystemFont(14),
    lineLimit: 1,
  });

  // create line for event start and end times
  let timeStack = stack.addStack();
  const time = `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
  addWidgetTextLine(timeStack, time, {
    color,
    opacity,
    font: Font.regularSystemFont(14),
  });
}

function addWidgetTextLine(
  widget,
  text,
  {
    color = "#ffffff",
    textSize = 12,
    opacity = 1,
    align,
    font = "",
    lineLimit = 0,
  }
) {
  let textLine = widget.addText(text);
  textLine.textColor = new Color(color);
  if (typeof font === "string") {
    textLine.font = new Font(font, textSize);
  } else {
    textLine.font = font;
  }
  console.log(`${text}`);
  console.log(`${typeof opacity}`);
  textLine.textOpacity = opacity;
  switch (align) {
    case "left":
      textLine.leftAlignText();
      break;
    case "center":
      textLine.centerAlignText();
      break;
    case "right":
      textLine.rightAlignText();
      break;
    default:
      textLine.leftAlignText();
      break;
  }
}

//time formater
function formatTime(timems){
  let time = new DateFormatter();
  time.useNoDateStyle();
  time.useShortTimeStyle();
  let timestring = time.string(timems);
  return timestring;
}
