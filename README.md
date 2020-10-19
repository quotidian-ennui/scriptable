# scriptable-widgets

The suggested name was `legendary-octo-fortnight`

This is just some widget things based on [scriptable](https://scriptable.app/) that I've been using to scratch an itch with my iphone.

- unsplash-pic.js -> Widget that downloads and displays a picture from the specified unsplash collection
   - The default is `4770206/gin-tonic`
   - Rotates on a daily basis
   - You need to setup a local bookmarked location within Scriptable called 'Pictures' since I do like to be explicit.
   - If you setup the widget so that the _When Interacting_ == _Run Script_ it'll change the picture.
   - If you don't want pictures of gin then change your widget parameters to : `{ "bg" : "background.png", "unsplash" : "224/winter-wonderland"}` or similar.
- home-no-background.js -> Widget that displays the Date + events + battery level.
   - It copies a lot of https://gist.github.com/rudotriton/b51d227c3d1d9cb497829ae45583224f ; so they should take the credit for all the hard work.

