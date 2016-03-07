# phonegap-plugin-mobile-accessibility
==========================================

This plugin exposes information on the status of various accessibility features of mobile operating systems, including, for example, whether a screen reader is running, invert colors is enabled, and the preferred scaling for text. It also allows an application to send a string to be spoken by the screen reader, or a command to stop the screen reader from speaking.

---------------
## Installation

    $ cordova plugin add https://github.com/phonegap/phonegap-mobile-accessibility.git

----------------------
## Supported Platforms

- Amazon Fire OS
- Android
- iOS

----------------------
## MobileAccessibility

The `MobileAccessibility` object, exposed by `window.MobileAccessibility`, provides methods for determining the status of accessibility features active on the user's device, methods changing the text zoom of the Cordova web view and for using the user's preferred text zoom as set in the operating system settings, and methods for sending a string to be spoken by the screen reader or to stop the screen reader from speaking.

-----------
### Methods

- MobileAccessibility.isScreenReaderRunning
- MobileAccessibility.isVoiceOverRunning
- MobileAccessibility.isTalkBackRunning
- MobileAccessibility.isChromeVoxActive
- MobileAccessibility.isClosedCaptioningEnabled
- MobileAccessibility.isGuidedAccessEnabled
- MobileAccessibility.isInvertColorsEnabled
- MobileAccessibility.isMonoAudioEnabled
- MobileAccessibility.isReduceMotionEnabled
- MobileAccessibility.isTouchExplorationEnabled
- MobileAccessibility.getTextZoom
- MobileAccessibility.setTextZoom
- MobileAccessibility.updateTextZoom
- MobileAccessibility.usePreferredTextZoom
- MobileAccessibility.postNotification
- MobileAccessibility.speak
- MobileAccessibility.stop

--------------------------------------------------------
#### MobileAccessibility.isScreenReaderRunning(callback)

Makes an asynchronous call to native `MobileAccessibility` to determine if a screen reader is running.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isScreenReaderRunningCallback(boolean) {
        if (boolean) {
            console.log("Screen reader: ON");
            // Do something to improve the behavior of the application while a screen reader is active.
        } else {
            console.log("Screen reader: OFF");
        }
    }

    MobileAccessibility.isScreenReaderRunning(isScreenReaderRunningCallback);
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS

-----------------------------------------------------
#### MobileAccessibility.isVoiceOverRunning(callback)


An iOS-specific proxy for the `MobileAccessibility.isScreenReaderRunning` method. This method will return `false` on Android and Amazon Fire OS.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isVoiceOverRunningCallback(boolean) {
        if (boolean) {
            console.log("Screen reader: ON");
            // Do something to improve the behavior of the application while a screen reader is active.
        } else {
            console.log("Screen reader: OFF");
        }
    }

    MobileAccessibility.isVoiceOverRunning(isVoiceOverRunningCallback);
```

##### Supported Platforms

- iOS

----------------------------------------------------
#### MobileAccessibility.isTalkBackRunning(callback)


An Android/Amazon Fire OS-specific proxy for the `MobileAccessibility.isScreenReaderRunning` method. This method will return `false` on iOS.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isTalkBackRunningCallback(boolean) {
        if (boolean) {
            console.log("Screen reader: ON");
            // Do something to improve the behavior of the application while a screen reader is active.
        } else {
            console.log("Screen reader: OFF");
        }
    }

    MobileAccessibility.isTalkBackRunning(isTalkBackRunningCallback);
```

##### Supported Platforms

- Amazon Fire OS
- Android

----------------------------------------------------
#### MobileAccessibility.isChromeVoxActive()


On Android, this method returns `true` if ChromeVox is active and properly initialized with access to the text to speech API in the WebView.
If TalkBack is running but ChromeVox is not active, this method is useful to alert the user of a potential problem.

##### Returns

- __boolean__ (Boolean) Returns `true` if ChromeVox is active and properly initialized with access to the text to speech API in the WebView.

##### Usage

```javascript
    MobileAccessibility.isTalkBackRunning(
        function (bool) {
            console.log('Talkback status: ' + bool);
            if (bool) {
                /* Use setTimeout to account for latency in initialization of ChromeVox */
                setTimeout(function() {
                    if (MobileAccessibility.isChromeVoxActive()) {
                        console.log('ChromeVox is active.');
                    } else {
                        console.log('ChromeVox is not active.');

                        /* Notify the user of a potential problem */
                        MobileAccessibility.speak('The ChromeVox screen reader has failed to initialize. You may wish to close and restart this app.');
                    }
                }, 5000);
            }
        });
```

##### Supported Platforms

- Amazon Fire OS
- Android

------------------------------------------------------------
#### MobileAccessibility.isClosedCaptioningEnabled(callback)


Makes an asynchronous call to native `MobileAccessibility` to determine if system-level closed captioning is enabled on the device.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isClosedCaptioningEnabledCallback(boolean) {
        if (boolean) {
            console.log("Closed Captioning: ON");
            // Do something to improve the behavior of the application while closed captioning is enabled.
        } else {
            console.log("Closed Captioning: OFF");
        }
    }

    MobileAccessibility.isClosedCaptioningEnabled(isClosedCaptioningEnabledCallback);
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS

--------------------------------------------------------
#### MobileAccessibility.isGuidedAccessEnabled(callback)


Makes an asynchronous call to native `MobileAccessibility` to determine if Guided Access is enabled.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isGuidedAccessEnabledCallback(boolean) {
        if (boolean) {
            console.log("Guided Access: ON");
            // Do something to improve the behavior of the application while Guided Access is enabled.
        } else {
            console.log("Guided Access: OFF");
        }
    }

    MobileAccessibility.isGuidedAccessEnabledEnabled(isGuidedAccessEnabledCallback);
```

##### Supported Platforms

- iOS

--------------------------------------------------------
#### MobileAccessibility.isInvertColorsEnabled(callback)


Makes an asynchronous call to native `MobileAccessibility` to determine if the display colors have been inverted.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isInvertColorsEnabledCallback(boolean) {
        if (boolean) {
            console.log("Invert Colors: ON");
            // Do something to improve the behavior of the application while Invert Colors is enabled.
        } else {
            console.log("Invert Colors: OFF");
        }
    }

    MobileAccessibility.isInvertColorsEnabled(isInvertColorsEnabledCallback);
```

##### Supported Platforms

- iOS

-----------------------------------------------------
#### MobileAccessibility.isMonoAudioEnabled(callback)

Makes an asynchronous call to native `MobileAccessibility` to determine if mono audio is enabled.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isMonoAudioEnabledCallback(boolean) {
        if (boolean) {
            console.log("Mono Audio: ON");
            // Do something to improve the behavior of the application while Mono Audio is enabled.
        } else {
            console.log("Mono Audio: OFF");
        }
    }

    MobileAccessibility.isMonoAudioEnabled(isMonoAudioEnabledCallback);
```

##### Supported Platforms

- iOS

----------------------------------------------------
#### MobileAccessibility.isReduceMotionEnabled(callback)


An iOS-specific proxy for the `MobileAccessibility.UIAccessibilityIsReduceMotionEnabled` method.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isReduceMotionEnabledCallback(boolean) {
        if (boolean) {
            console.log("Reduce Motion: ON");
            // Do something to improve the behavior of the application when reduce motion is enabled.
        } else {
            console.log("Reduce Motion: OFF");
        }
    }

    MobileAccessibility.isReduceMotionEnabled(isReduceMotionEnabledCallback);
```

##### Supported Platforms

- iOS

------------------------------------------------------------
#### MobileAccessibility.isTouchExplorationEnabled(callback)

Makes an asynchronous call to native `MobileAccessibility` to determine if Touch Exploration is enabled on Android.

##### Parameters

- __callback__ (Function) A callback method to receive the boolean result asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function isTouchExplorationEnabledCallback(boolean) {
        if (boolean) {
            console.log("Touch Exploration: ON");
            // Do something to improve the behavior of the application with Touch Exploration enabled.
        } else {
            console.log("Touch Exploration: OFF");
            // Do something to improve the behavior of the application with Touch Exploration disabled.

        }
    }

    MobileAccessibility.isTouchExplorationEnabled(isTouchExplorationEnabledCallback);
```

##### Supported Platforms

- Amazon Fire OS
- Android

--------------------------------------------------------
#### MobileAccessibility.getTextZoom(callback)

Makes an asynchronous call to native `MobileAccessibility` to return the current text zoom percent value for the WebView.

##### Parameters

- __callback__ (Function) A callback method to receive the text zoom percent value asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function getTextZoomCallback(textZoom) {
        console.log('Current text zoom = ' + textZoom + '%')
    }

    MobileAccessibility.getTextZoom(getTextZoomCallback);
```
##### Supported Platforms

- Amazon Fire OS
- Android
- iOS

--------------------------------------------------------
#### MobileAccessibility.setTextZoom(textZoom, callback)

Makes an asynchronous call to native `MobileAccessibility` to set the current text zoom percent value for the WebView.

##### Parameters

- __textZoom__ (Number) A percentage value by which text in the WebView should be scaled.
- __callback__ (Function) A callback method to receive the new text zoom percent value asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function setTextZoomCallback(textZoom) {
        console.log('WebView text should be scaled ' + textZoom + '%')
    }

    MobileAccessibility.setTextZoom(200, setTextZoomCallback);
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS

-------------------------------------------------
#### MobileAccessibility.updateTextZoom(callback)

Makes an asynchronous call to native `MobileAccessibility` to retrieve the user's preferred text zoom from system settings and apply it to the application WebView.

##### Parameters

- __callback__ (Function) A callback method to receive the new text zoom percent value asynchronously from the native `MobileAccessibility` plugin.

##### Usage

```javascript
    function updateTextZoomCallback(textZoom) {
        console.log('WebView text should be scaled ' + textZoom + '%')
    }

    MobileAccessibility.updateTextZoom(callback);
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS7+

------------------------------------------------------
#### MobileAccessibility.usePreferredTextZoom(boolean)

Specifies whether or not the application should use the user's preferred text zoom from system settings to scale text within the WebView.
When set to `true`, this method calls `MobileAccessibility.updateTextZoom()` to apply new text zoom settings to the application WebView. When set to `false`, the application WebView text zoom will be reset to the default value of `100` percent. The plugin uses local storage to retain the preference and will call `MobileAccessibility.updateTextZoom()` after a Cordova `resume` event.

##### Parameters

- __boolean__ (Boolean) A Boolean value which specifies whether to use the preferred text zoom of a default percent value of 100.

##### Usage

```javascript
    MobileAccessibility.usePreferredTextZoom(true);

    function getTextZoomCallback(textZoom) {
        console.log('WebView text should be scaled to the preferred value ' + textZoom + '%')
    }

    MobileAccessibility.getTextZoom(getTextZoomCallback);
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS7+

--------------------------------------------------------------------------------------------
#### MobileAccessibility.postNotification(mobileAccessibilityNotification, string, callback)

Posts a notification with a string for the screen reader to announce if it is running.

##### Parameters

- __mobileAccessibilityNotification__ (uint) A numeric constant for the type of notification to send. Constants are defined in `MobileAccessibilityNotifications`.
- __string__ (string) A string to be announced by a screen reader.
- __callback__ (function) A callback method to receive the asynchronous result from the native `MobileAccessibility`, when the announcement is finished, the function should expect an object containing the `stringValue` that was voiced and a boolean indicating that the announcement `wasSuccessful`.

##### Constants

The following constants are for sending notifications to the accessibility API using the `MobileAccessibility.postNotification` method. They correspond to notification constants defined in [UIAccessibilityNotifications](https://developer.apple.com/library/ios/documentation/uikit/reference/UIAccessibility_Protocol/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008786-CH1-DontLinkElementID_3) on iOS.

- MobileAccessibilityNotifications.SCREEN_CHANGED
- MobileAccessibilityNotifications.LAYOUT_CHANGED
- MobileAccessibilityNotifications.ANNOUNCEMENT
- MobileAccessibilityNotifications.PAGE_SCROLLED

```javascript
    MobileAccessibility.postNotification(
        MobileAccessibilityNotifications.ANNOUNCEMENT,
        'String to be announced by screen reader.',
        function(info) {
            if (info) {
                console.log("Screen Reader announced \"" + info.stringValue + "\" success : " + info.wasSuccessful);
            }
        });
```

##### Supported Platforms

- iOS

-------------------------------------------------------------
#### MobileAccessibility.speak(string, queueMode, properties)


Speaks a given string through the screenreader. On Android, if ChromeVox is active, it will use the specified queueMode and properties.

##### Parameters

- __string__ (string) A string to be announced by a screen reader.
- __queueMode__ (Optional number) Valid modes are 0 for flush; 1 for queue.
- __properties__ (Optional Object) Speech properties to use for this utterance.

```javascript
    MobileAccessibility.speak('This string will be announced when a screen reader is active on the device.');
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS

-------------------------------
#### MobileAccessibility.stop()

Stops speech.

```javascript
    MobileAccessibility.stop();
```

##### Supported Platforms

- Amazon Fire OS
- Android
- iOS

----------
### Events

--------------
#### Constants

The following event constants are for `window` events, to which an application can listen for notification of changes in the status of the accessibility features on the device.

- MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED
- MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED
- MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED
- MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED
- MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED
- MobileAccessibilityNotifications.REDUCE_MOTION_STATUS_CHANGED
- MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED

----------------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED (screenreaderstatuschanged)

The event fires when a screen reader on the device turns on or off.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isScreenReaderRunning` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onScreenReaderStatusChanged(info) {
        if (info && typeof info.isScreenReaderRunning !== "undefined") {
            if (info.isScreenReaderRunning) {
                console.log("Screen reader: ON");
                // Do something to improve the behavior of the application while a screen reader is active.
            } else {
                console.log("Screen reader: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED, onScreenReaderStatusChanged, false);
```

------------------------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED (closedcaptioningstatuschanged)

The event fires when system-level closed captioning on the device turns on or off.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isClosedCaptioningEnabled` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onClosedCaptioningStatusChanged(info) {
        if (info && typeof info.isClosedCaptioningEnabled !== "undefined") {
            if (info.isClosedCaptioningEnabled) {
                console.log("Closed Captioning: ON");
                // Do something to improve the behavior of the application while closed captioning is enabled.
            } else {
                console.log("Closed Captioning: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED, onClosedCaptioningStatusChanged, false);
```

----------------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED (guidedaccessstatuschanged)

The event fires when Guided Access has been enabled on an iOS device.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isGuidedAccessEnabled` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onGuidedAccessStatusChanged(info) {
        if (info && typeof info.isGuidedAccessEnabled !== "undefined") {
            if (info.isGuidedAccessEnabled) {
                console.log("Guided Access: ON");
                // Do something to improve the behavior of the application while Guided Access is enabled.
            } else {
                console.log("Guided Access: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED, onGuidedAccessStatusChanged, false);
```

----------------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED (invertcolorsstatuschanged)

The event fires when Invert Colors has been enabled on an iOS device.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isInvertColorsEnabled` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onInvertColorsStatusChanged(info) {
        if (info && typeof info.isInvertColorsEnabled !== "undefined") {
            if (info.isInvertColorsEnabled) {
                console.log("Invert Colors: ON");
                // Do something to improve the behavior of the application while Invert Colors is enabled.
            } else {
                console.log("Invert Colors: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED, onInvertColorsStatusChanged, false);
```

----------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED (monoaudiostatuschanged)

The event fires when Mono Audio has been enabled on an iOS device.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isMonoAudioEnabled` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onMonoAudioStatusChanged(info) {
        if (info && typeof info.isMonoAudioEnabled !== "undefined") {
            if (info.isMonoAudioEnabled) {
                console.log("Mono Audio: ON");
                // Do something to improve the behavior of the application while Mono Audio is enabled.
            } else {
                console.log("Mono Audio: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED, onMonoAudioStatusChanged, false);
```

----------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.REDUCE_MOTION_STATUS_CHANGED (reducemotionstatuschanged)

The event fires when Reduce Motion has been enabled on an iOS device.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isReduceMotionEnabled` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onReduceMotionStatusChanged(info) {
        if (info && typeof info.isReduceMotionEnabled !== "undefined") {
            if (info.isReduceMotionEnabled) {
                console.log("Reduce Motion: ON");
                // Do something to improve the behavior of the application while Reduce Motion is enabled.
            } else {
                console.log("Reduce Motion: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.REDUCE_MOTION_STATUS_CHANGED, onMReduceMotionStatusChanged, false);
```

------------------------------------------------------------------------------------------------------
#### MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED (touchexplorationstatuschanged)

The event fires when Touch Exploration has been enabled on an Android device.
The event returns an object, `info`, with the current status of accessibility features on the device.
If a screen reader is active, `info.isTouchExplorationEnabled` will equal `true`.

```javascript
    // Define a persistent callback method to handle the event
    function onTouchExplorationChanged(info) {
        if (info && typeof info.isTouchExplorationEnabled !== "undefined") {
            if (info.isTouchExplorationEnabled) {
                console.log("Touch Exploration: ON");
                // Do something to improve the behavior of the application while Touch Exploration is enabled.
            } else {
                console.log("Touch Exploration: OFF");
            }
        }
    }

    // Register the callback method to handle the event
    window.addEventListener(MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED, onTouchExplorationChanged, false);
```
