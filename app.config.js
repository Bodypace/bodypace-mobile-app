const IS_DEV = process.env.BODYPACE_APP_VARIANT === 'development';

module.exports = () => ({
  "expo": {
    "name": IS_DEV ? "Bodypace (Dev)" : "Bodypace",
    "owner": "bodypace",
    "slug": "mobile-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/heart_512.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": IS_DEV ? "com.bodypace.dev.mobileapp" : "com.bodypace.mobileapp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "0d0c5d75-d330-4388-84a4-25719bfb414a"
      }
    }
  }
})
