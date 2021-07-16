# Cereal
## Stream tv shows + movies 

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![devDependencies Status](https://david-dm.org/paulsutherland/Polyonic/dev-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=dev)
[![optionalDependencies Status](https://david-dm.org/paulsutherland/Polyonic/optional-status.svg)](https://david-dm.org/paulsutherland/Polyonic?type=optional)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

> Using Ionic 5, Electron 11 and Angular 11 :tada:.

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
