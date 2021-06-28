# Cereal
## Strean tv shows + movies 

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![devDependencies Status](https://david-dm.org/paulsutherland/Polyonic/dev-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=dev)
[![optionalDependencies Status](https://david-dm.org/paulsutherland/Polyonic/optional-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=optional)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

> Now using Ionic 5, Electron 11 and Angular 11 :tada:. See here for [Ionic 1](https://github.com/paulsutherland/Polyonic/tree/Ionic1) and [Ionic 3](https://github.com/paulsutherland/Polyonic/tree/Ionic3).

## Quick start

The dependencies for this project are [Node.js](https://nodejs.org), [Ionic Framework](https://ionicframework.com/) and [Cordova](https://cordova.apache.org/).

You will need the latest Node 14 LTS and NPM 7 installed.

Make sure you have [node installed and running](https://nodejs.org/en/download/), then install Ionic and Cordova globally using npm.

```node
npm install -g ionic@latest cordova@latest
```

## Running live reload for development

When developing, you will want to have the app live reload as you save your changes.

### Desktop

```node
npm run electron:dev
```

For debugging the main process you will need to have the Chrome Browser installed.

```node
npm run electron:dev:debug
```

Open Chrome and navigate to chrome://inspect/ and select the Electron remote target that is available to attach the debugger to.

If you require live reloading of the main process debugging session, then it is recommended that you install the Chrome plugin [Node.js V8 --inspector Manager (NiM)](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=en). In the plugin settings, set the host to localhost, the port to 9229 and the app to auto.  This will allow you to live reload changes made to the main process (electron.js file).

```node
npm run electron:dev:debug-live
```

### iOS

#### Emulator

```node
npm run emulate:ios-dev
```

#### Device

```node
npm run device:ios-dev
```

### Android

#### Emulator

```node
npm run emulate:android-dev
```

#### Device

```node
npm run device:android-dev
```

## Building on Windows

For building on Windows you will need to install the Nullsoft Scriptable Install System.

You can [download NSIS here](http://nsis.sourceforge.net/Main_Page)

You will need to make sure the NSIS path is added as an environment variable:

```node
setx PATH "%PATH%;C:\Program Files (x86)\NSIS"
```

Or using [point and click](http://nsis.sourceforge.net/Main_Page).

## Porting existing Ionic Apps

It is possible to port your existing apps to run on the desktop, but you may need to make some platform adjustments to call out to an equivalent api for any mobile plugins your app uses.  The app includes and angular service for electron which makes is easy to call the Electron APIs from within the Ionic components.

For example you may want to check what platform you are running on before you make an api call, either calling out to an Ionic plugin, an Electron api or a browser api.  

The data service component ```data.service.ts``` has an example of setting up a PouchDB database depending upon what platform the app is running on.  

```javascript
import { ElectronService } from './electron.service'
import { Platform } from '@ionic/angular'

...

constructor(public electron: ElectronService, private platform: Platform) {}

...

public setup() {
    const ctx = this
    console.log('Setting up the application database')

    if (ctx.electron.isElectronApp) {
      return ctx.desktopDB()
    }
    if (ctx.platform.is('mobile')) {
      return ctx.mobileDB()
    } else {
      return ctx.webDB()
    }
}

```

## Encryption at rest

If your app requires your data to be encrypted at rest, the app includes an example of using the [cordova-sqlcipher-adapter](https://github.com/brodybits/cordova-sqlcipher-adapter) plugin for Ionic and the [polyonic-secure-pouch](https://github.com/paulsutherland/polyonic-secure-pouch) plugin for the desktop and browser.

The Cordova example encrypts the local sqlite database, whereas the secure pouch plugin encrypts and decrypts your data when it is saved or fetched from the browser database. Either way, at rest, your data is encrypted.

You will need to include a key or password/secret from the user, or an api app, to encrypt the data.  You can store this key in [Ionic Secure Storage](https://ionicframework.com/docs/native/secure-storage/) or for the desktop you can use [Keytar](https://github.com/atom/node-keytar).  

## NPM Script Commands

| Platform/Commands ||
|:-|:-|
| **Desktop** ||
| `npm run electron:dev` | For development using live reload and opens with developer tools |
| `npm run electron:local` | Build and run on the desktop, no livereload or developer tools |
| `npm run electron:linux` | Production build for linux platform.  (Requires Linux) |
| `npm run electron:mac` | Production build for macOS.  (Requires macOS) |
| `npm run electron:windows` | Production build for Windows.  (Requires Windows) |
| **iOS** ||
| `npm run emulate:ios-dev` | For iOS development on the simulator using live reload |
| `npm run emulate:ios` | For iOS development on the simulator |
| `npm run device:ios-dev` | For iOS development on an iOS device using live reload |
| `npm run device:ios` | For iOS development on an iOS device |
| `npm run release:ios` | Production build for iOS.  (Requires XCode on macOS) |
| **Android** ||
| `npm run emulate:android-dev` | For Android development on an emulator using live reload |
| `npm run emulate:android` | For Android development on an emulator |
| `npm run device:android-dev` | For Android development on an Android device using live reload |
| `npm run device:android` | For Android development on an Android device |
| **Web Apps and PWA Apps** ||
| `npm run ionic` | For web and progressive web app development using live reload |

## Publishing your apps

[How to publish an Android App](https://ionicframework.com/docs/publishing/play-store)

[How to publish an iOS App](https://ionicframework.com/docs/publishing/play-store)

[How to publish a macOS and/or Windows App](https://ionicframework.com/docs/publishing/desktop-app)

[How to publish a progressive web app](https://ionicframework.com/docs/publishing/progressive-web-app)

## Credits

This application was built using the [Electron Framework](http://electron.atom.io/) :heart: for creating desktop apps and [Ionic Framework](http://ionicframework.com/) :heart: for the UI and creating Native Mobile Applications, Progressive Mobile Web Applications and Web Applications.

The app was inspired by:

[Angular Electron Shell](https://github.com/maximegris/angular-electron) :punch:

[Simple Cryptor Pouch Plugin](https://www.npmjs.com/package/simple-cryptor-pouch) (forked to create the [polyonic-secure-pouch](https://github.com/paulsutherland/polyonic-secure-pouch) plugin). :pray:

## Polyonic for Enterprise

This project is a generic shell/seed project that lets you build your app for multiple platforms.  For Enterprise use, including:

- Azure AD multi-tenancy Integration
- Office 365 apps
- Realtime CouchDB integration
- End to end encryption
- Support services
- WebXR
- WebRTC

You can contact us at [polyonic.com](http://polyonic.com) :metal:

## License

Released under the MIT license.
