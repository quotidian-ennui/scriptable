// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: images;
// Widget parameters are json, because that's cool right
// { "bg" : "background.jpg", "unsplash" : "224"}
// You will need to setup a bookmarked local path called "Pictures" for Scriptables to use.
// Image changes daily.
// If you set the action when you click to be "run script"; then it will change the picture.

const params = JSON.parse(args.widgetParameter) || { "bg" : "daily-background.jpg", "unsplash" : "50603271"};
const imgCollection = params.unsplash;
const unsplashUrl = "https://source.unsplash.com/collection/";
let forcedDownload = false;
const baseImage= params.bg;

// Store current datetime
const today = new Date();

if (config.runsInWidget) {
  let widget = await createWidget();
  Script.setWidget(widget);
  Script.complete();
} else {
  forcedDownload = true;
  let widget = await createWidget();
  Script.setWidget(widget);
  widget.presentLarge();
  Script.complete();
}

async function createWidget() {
  let widget = new ListWidget();

  // Add more minimal overlay
  let gradient = new LinearGradient();
  gradient.colors = [new Color("#000000", 0.5), new Color("#ffffff", 0)];
  gradient.locations = [0, 0.5];
  widget.backgroundGradient = gradient;
  widget.addSpacer();
  // Look for the image file
  await setBackground(widget);
  // Finalize widget settings
  widget.setPadding(16, 16, 16, 0);
  widget.spacing = -3;
  return widget;
}


async function setBackground(widget) {
  let fileManager = FileManager.local();
  var backgroundImageURL = fileManager.bookmarkedPath("Pictures") + "/" + baseImage;
  if (fileManager.fileExists(backgroundImageURL) == false) {
    forcedDownload = true;
  } else {
    const modificationDate = fileManager.modificationDate(backgroundImageURL);
    if (!sameDay(modificationDate, today)) {
      forcedDownload = true;
    }
  }
  if (forcedDownload) {
    try {
      let img = await provideImage(imgCollection);
      fileManager.writeImage(backgroundImageURL, img);
      widget.backgroundImage = img;
    } catch {
      widget.backgroundImage = fileManager.readImage(backgroundImageURL);
    }
  } else {
    widget.backgroundImage = fileManager.readImage(backgroundImageURL);
  }
}


// Fetch a image from Unsplash by its collection id
async function provideImage(id) {
  const img = await downloadImage(
    unsplashUrl + id
  );
  return img;
}

// Helper function to download images
async function downloadImage(url) {
  const req = new Request(url);
  return await req.loadImage();
}

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}
