/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    device = require('cordova-plugin-device.device'),
    network = require('cordova-plugin-network-information.network'),
    connection = require('cordova-plugin-network-information.Connection'),
    MobileAccessibilityNotifications = require('phonegap-plugin-mobile-accessibility.MobileAccessibilityNotifications');

var MobileAccessibility = function() {
    this._isBoldTextEnabled = false;
    this._isClosedCaptioningEnabled = false;
    this._isDarkerSystemColorsEnabled = false;
    this._isGrayscaleEnabled = false;
    this._isGuidedAccessEnabled = false;
    this._isInvertColorsEnabled = false;
    this._isMonoAudioEnabled = false;
    this._isReduceMotionEnabled = false;
    this._isReduceTransparencyEnabled = false;
    this._isScreenReaderRunning = false;
    this._isSpeakScreenEnabled = false;
    this._isSpeakSelectionEnabled = false;
    this._isSwitchControlRunning = false;
    this._isTouchExplorationEnabled = false;
    this._usePreferredTextZoom = false;
    this._isHighContrastEnabled = false;
    this._highContrastScheme = undefined;

    // Create new event handlers on the window (returns a channel instance)
    this.channels = {
        boldtextstatuschanged           : cordova.addWindowEventHandler(MobileAccessibilityNotifications.BOLD_TEXT_STATUS_CHANGED),
        closedcaptioningstatuschanged   : cordova.addWindowEventHandler(MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED),
        darkersystemcolorsstatuschanged : cordova.addWindowEventHandler(MobileAccessibilityNotifications.DARKER_SYSTEM_COLORS_STATUS_CHANGED),
        grayscalestatuschanged          : cordova.addWindowEventHandler(MobileAccessibilityNotifications.GRAYSCALE_STATUS_CHANGED),
        guidedaccessstatuschanged       : cordova.addWindowEventHandler(MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED),
        invertcolorsstatuschanged       : cordova.addWindowEventHandler(MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED),
        monoaudiostatuschanged          : cordova.addWindowEventHandler(MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED),
        reducemotionstatuschanged       : cordova.addWindowEventHandler(MobileAccessibilityNotifications.REDUCE_MOTION_STATUS_CHANGED),
        reducetransparencystatuschanged : cordova.addWindowEventHandler(MobileAccessibilityNotifications.REDUCE_TRANSPARENCY_STATUS_CHANGED),
        screenreaderstatuschanged       : cordova.addWindowEventHandler(MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED),
        speakscreenstatuschanged        : cordova.addWindowEventHandler(MobileAccessibilityNotifications.SPEAK_SCREEN_STATUS_CHANGED),
        speakselectionstatuschanged     : cordova.addWindowEventHandler(MobileAccessibilityNotifications.SPEAK_SELECTION_STATUS_CHANGED),
        switchcontrolstatuschanged      : cordova.addWindowEventHandler(MobileAccessibilityNotifications.SWITCH_CONTROL_STATUS_CHANGED),
        touchexplorationstatechanged    : cordova.addWindowEventHandler(MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED),
        highcontrastchanged             : cordova.addWindowEventHandler(MobileAccessibilityNotifications.HIGH_CONTRAST_CHANGED)
    };
    for (var key in this.channels) {
        this.channels[key].onHasSubscribersChange = MobileAccessibility.onHasSubscribersChange;
    }
};

/**
 * @private
 * @ignore
 */
function handlers() {
    return mobileAccessibility.channels.boldtextstatuschanged.numHandlers +
           mobileAccessibility.channels.closedcaptioningstatuschanged.numHandlers +
           mobileAccessibility.channels.darkersystemcolorsstatuschanged.numHandlers +
           mobileAccessibility.channels.grayscalestatuschanged.numHandlers +
           mobileAccessibility.channels.guidedaccessstatuschanged.numHandlers +
           mobileAccessibility.channels.invertcolorsstatuschanged.numHandlers +
           mobileAccessibility.channels.monoaudiostatuschanged.numHandlers +
           mobileAccessibility.channels.reducemotionstatuschanged.numHandlers +
           mobileAccessibility.channels.reducetransparencystatuschanged.numHandlers +
           mobileAccessibility.channels.screenreaderstatuschanged.numHandlers +
           mobileAccessibility.channels.speakscreenstatuschanged.numHandlers +
           mobileAccessibility.channels.speakselectionstatuschanged.numHandlers +
           mobileAccessibility.channels.switchcontrolstatuschanged.numHandlers +
           mobileAccessibility.channels.touchexplorationstatechanged.numHandlers +
           mobileAccessibility.channels.highcontrastchanged.numHandlers;
};

/**
 *
 * Event handlers for when callback methods get registered for mobileAccessibility.
 * Keep track of how many handlers we have so we can start and stop the native MobileAccessibility listener
 * appropriately.
 * @private
 * @ignore
 */
MobileAccessibility.onHasSubscribersChange = function() {
    // If we just registered the first handler, make sure native listener is started.
    if (this.numHandlers === 1 && handlers() === 1) {
        exec(mobileAccessibility._status, mobileAccessibility._error, "MobileAccessibility", "start", []);
    } else if (handlers() === 0) {
        exec(null, null, "MobileAccessibility", "stop", []);
    }
};

/**
 * Asynchronous call to native MobileAccessibility determine if a screen reader is running.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isScreenReaderRunning = function(callback) {
    exec(function(bool) {
        mobileAccessibility.activateOrDeactivateChromeVox(bool);
        callback(Boolean(bool));
    }, null, "MobileAccessibility", "isScreenReaderRunning", []);
};
MobileAccessibility.prototype.isVoiceOverRunning = function(callback) {
    if (device.platform.toLowerCase() === "ios") {
        MobileAccessibility.prototype.isScreenReaderRunning(callback);
    } else {
        callback(false);
    }
};
MobileAccessibility.prototype.isTalkBackRunning = function(callback) {
    if (device.platform.toLowerCase() === "android" || device.platform.toLowerCase() === "amazon-fireos") {
        MobileAccessibility.prototype.isScreenReaderRunning(callback);
    } else {
        callback(false);
    }
};
MobileAccessibility.prototype.isChromeVoxActive = function () {
    return typeof cvox !== "undefined" && cvox.ChromeVox.host.ttsLoaded() && cvox.Api.isChromeVoxActive();
};
MobileAccessibility.prototype.activateOrDeactivateChromeVox = function(bool) {
    if (device.platform !== "Android") return;
    if (typeof cvox === "undefined") {
        if (bool) {
            console.warn('A screen reader is running but ChromeVox has failed to initialize.');
            if (navigator.connection.type === Connection.UNKNOWN || navigator.connection.type === Connection.NONE) {
                mobileAccessibility.injectLocalAndroidVoxScript();
            }
        }
    } else {
        // activate or deactivate ChromeVox based on whether or not or not the screen reader is running.
        try {
            cvox.ChromeVox.host.activateOrDeactivateChromeVox(bool);
        } catch (err) {
            console.error(err);
        }
    }

    if (bool) {
        if (!mobileAccessibility.hasOrientationChangeListener) {
            window.addEventListener("orientationchange", mobileAccessibility.onOrientationChange);
            mobileAccessibility.hasOrientationChangeListener = true;
        }
    } else if(mobileAccessibility.hasOrientationChangeListener) {
        window.removeEventListener("orientationchange", mobileAccessibility.onOrientationChange);
        mobileAccessibility.hasOrientationChangeListener = false;
    }
};

MobileAccessibility.prototype.hasOrientationChangeListener = false;
MobileAccessibility.prototype.onOrientationChange = function(event) {
    if (!mobileAccessibility.isChromeVoxActive()) return;
    cvox.ChromeVox.navigationManager.updateIndicator();
};

MobileAccessibility.prototype.scriptInjected = false;
MobileAccessibility.prototype.injectLocalAndroidVoxScript = function() {
    var versionsplit = device.version.split('.');
    if (device.platform !== "Android" ||
        !(versionsplit[0] > 4 || (versionsplit[0] == 4 && versionsplit[1] >= 1))  ||
        typeof cvox !== "undefined" || mobileAccessibility.scriptInjected) return;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // console.log(this.src + ' has loaded');
        if (mobileAccessibility.isChromeVoxActive()) {
            cordova.fireWindowEvent("screenreaderstatuschanged", {
                isScreenReaderRunning: true
            });
        }
    };

    script.src = (versionsplit[0] > 4 || versionsplit[1] > 3)
        ? "plugins/com.phonegap.plugin.mobile-accessibility/android/chromeandroidvox.js"
        : "plugins/com.phonegap.plugin.mobile-accessibility/android/AndroidVox_v1.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    mobileAccessibility.scriptInjected = true;
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Bold Text is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isBoldTextEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isBoldTextEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Closed Captioning is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isClosedCaptioningEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isClosedCaptioningEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Darker System Colors are enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isDarkerSystemColorsEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isDarkerSystemColorsEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Grayscale is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isGrayscaleEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isGrayscaleEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Guided Access is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isGuidedAccessEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isGuidedAccessEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if the display colors have been inverted.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isInvertColorsEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isInvertColorsEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Mono Audio is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isMonoAudioEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isMonoAudioEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Reduce Motion is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isReduceMotionEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isReduceMotionEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Reduce Transparency is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isReduceTransparencyEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isReduceTransparencyEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Speak Screen is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isSpeakScreenEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isSpeakScreenEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Speak Selection is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isSpeakSelectionEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isSpeakSelectionEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Switch Control is running.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isSwitchControlRunning = function(callback) {
    exec(callback, null, "MobileAccessibility", "isSwitchControlRunning", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Touch Exploration is enabled on Android.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isTouchExplorationEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isTouchExplorationEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if High Contrast is enabled on Windows.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isHighContrastEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isHighContrastEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to return the current text zoom percent value for the WebView.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.getTextZoom = function(callback) {
    exec(callback, null, "MobileAccessibility", "getTextZoom", []);
};

/**
 * Asynchronous call to native MobileAccessibility to set the current text zoom percent value for the WebView.
 * @param {Number} textZoom A percentage value by which text in the WebView should be scaled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.setTextZoom = function(textZoom, callback) {
    exec(callback, null, "MobileAccessibility", "setTextZoom", [textZoom]);
};

/**
 * Asynchronous call to native MobileAccessibility to retrieve the user's preferred text zoom from system settings and apply it to the application WebView.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.updateTextZoom = function(callback) {
    exec(callback, null, "MobileAccessibility", "updateTextZoom", []);
};

MobileAccessibility.prototype.usePreferredTextZoom = function(bool) {
    var currentValue = window.localStorage.getItem("MobileAccessibility.usePreferredTextZoom") === "true";

    if (arguments.length === 0) {
        return currentValue;
    }

    if (currentValue != bool) {
        window.localStorage.setItem("MobileAccessibility.usePreferredTextZoom", bool);
    }

    var callback = function(){
        // Wrapping updateTextZoom call in a function to stop
        // the event parameter propagation. This fixes an error
        // on resume where cordova tried to call apply() on the
        // event, expecting a function.
        mobileAccessibility.updateTextZoom();
    };

    document.removeEventListener("resume", callback);

    if (bool) {
        // console.log("We should update the text zoom at this point: " + bool)
        document.addEventListener("resume", callback, false);
        mobileAccessibility.updateTextZoom();
    } else {
        mobileAccessibility.setTextZoom(100);
    }

    return Boolean(bool);
};

MobileAccessibility.prototype.MobileAccessibilityNotifications = MobileAccessibilityNotifications;

/**
 * Posts a notification with a string for a screen reader to announce, if it is running.
 * @param {uint} mobileAccessibilityNotification A numeric constant for the type of notification to send. Constants are defined in MobileAccessibility.MobileAccessibilityNotifications.
 * @param {string} string A string to be announced by a screen reader.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility, when the announcement is finished, the function should expect an object containing the stringValue that was voiced and a boolean indicating that the announcement wasSuccessful.
 */
MobileAccessibility.prototype.postNotification = function(mobileAccessibilityNotification, string, callback) {
    exec(callback, null, "MobileAccessibility", "postNotification", [mobileAccessibilityNotification, string]);
};

/**
 * Speaks the given string, and if ChromeVox is active, it will use the specified queueMode and properties.
 * @param {string} string A string to be announced by a screen reader.
 * @param {number} [queueMode] Optional number. Valid modes are 0 for flush; 1 for queue.
 * @param {Object} [properties] Speech properties to use for this utterance.
 */
MobileAccessibility.prototype.speak = function(string, queueMode, properties) {
    if (this.isChromeVoxActive()) {
        cvox.ChromeVox.tts.speak(string, queueMode, properties);
    } else {
        exec(null, null, "MobileAccessibility", "postNotification", [MobileAccessibilityNotifications.ANNOUNCEMENT, string]);
    }
}

/**
 * Stops speech.
 */
MobileAccessibility.prototype.stop = function() {
    if (this.isChromeVoxActive()) {
        cvox.ChromeVox.tts.stop();
    } else {
        exec(null, null, "MobileAccessibility", "postNotification", [MobileAccessibilityNotifications.ANNOUNCEMENT, "\u200b"]);
    }
}

/**
 * Callback from native MobileAccessibility returning an object which describes the status of MobileAccessibility features.
 *
 * @param {Object} info
 * @config {Boolean} [isBoldTextEnabled] Boolean to indicate bold text status (ios).
 * @config {Boolean} [isClosedCaptioningEnabled] Boolean to indicate closed captioning status.
 * @config {Boolean} [isDarkerSystemColorsEnabled] Boolean to indicate darker system colors status (ios).
 * @config {Boolean} [isGrayscaleEnabled] Boolean to indicate grayscale status (ios).
 * @config {Boolean} [isGuidedAccessEnabled] Boolean to indicate guided access status (ios).
 * @config {Boolean} [isInvertColorsEnabled] Boolean to indicate invert colors status (ios).
 * @config {Boolean} [isMonoAudioEnabled] Boolean to indicate mono audio status (ios).
 * @config {Boolean} [isReduceMotionEnabled] Boolean to indicate reduce motion status (ios).
 * @config {Boolean} [isReduceTransparencyEnabled] Boolean to indicate reduce transparency status (ios).
 * @config {Boolean} [isScreenReaderRunning] Boolean to indicate screen reader status.
 * @config {Boolean} [isSpeakScreenEnabled] Boolean to indicate speak screen status (ios).
 * @config {Boolean} [isSpeakSelectionEnabled] Boolean to indicate speak selection status (ios).
 * @config {Boolean} [isSwitchControlRunning] Boolean to indicate switch control status (ios).
 * @config {Boolean} [isTouchExplorationEnabled] Boolean to indicate touch exploration status (android).
 */
MobileAccessibility.prototype._status = function(info) {
    if (info) {
        mobileAccessibility.activateOrDeactivateChromeVox(info.isScreenReaderRunning);
        if (mobileAccessibility._isBoldTextEnabled !== info.isBoldTextEnabled) {
            mobileAccessibility._isBoldTextEnabled = info.isBoldTextEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.BOLD_TEXT_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isClosedCaptioningEnabled !== info.isClosedCaptioningEnabled) {
            mobileAccessibility._isClosedCaptioningEnabled = info.isClosedCaptioningEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isDarkerSystemColorsEnabled !== info.isDarkerSystemColorsEnabled) {
            mobileAccessibility._isDarkerSystemColorsEnabled = info.isDarkerSystemColorsEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.DARKER_SYSTEM_COLORS_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isGrayscaleEnabled !== info.isGrayscaleEnabled) {
            mobileAccessibility._isGrayscaleEnabled = info.isGrayscaleEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.GRAYSCALE_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isGuidedAccessEnabled !== info.isGuidedAccessEnabled) {
            mobileAccessibility._isGuidedAccessEnabled = info.isGuidedAccessEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isInvertColorsEnabled !== info.isInvertColorsEnabled) {
            mobileAccessibility._isInvertColorsEnabled = info.isInvertColorsEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isMonoAudioEnabled !== info.isMonoAudioEnabled) {
           mobileAccessibility._isMonoAudioEnabled = info.isMonoAudioEnabled;
           cordova.fireWindowEvent(MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isReduceMotionEnabled !== info.isReduceMotionEnabled) {
           mobileAccessibility._isReduceMotionEnabled = info.isReduceMotionEnabled;
           cordova.fireWindowEvent(MobileAccessibilityNotifications.REDUCE_MOTION_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isReduceTransparencyEnabled !== info.isReduceTransparencyEnabled) {
           mobileAccessibility._isReduceTransparencyEnabled = info.isReduceTransparencyEnabled;
           cordova.fireWindowEvent(MobileAccessibilityNotifications.REDUCE_TRANSPARENCY_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isScreenReaderRunning !== info.isScreenReaderRunning) {
            mobileAccessibility._isScreenReaderRunning = info.isScreenReaderRunning;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isSpeakScreenEnabled !== info.isSpeakScreenEnabled) {
           mobileAccessibility._isSpeakScreenEnabled = info.isSpeakScreenEnabled;
           cordova.fireWindowEvent(MobileAccessibilityNotifications.SPEAK_SCREEN_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isSpeakSelectionEnabled !== info.isSpeakSelectionEnabled) {
           mobileAccessibility._isSpeakSelectionEnabled = info.isSpeakSelectionEnabled;
           cordova.fireWindowEvent(MobileAccessibilityNotifications.SPEAK_SELECTION_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isSwitchControlRunning !== info.isSwitchControlRunning) {
           mobileAccessibility._isSwitchControlRunning = info.isSwitchControlRunning;
           cordova.fireWindowEvent(MobileAccessibilityNotifications.SWITCH_CONTROL_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isTouchExplorationEnabled !== info.isTouchExplorationEnabled) {
            mobileAccessibility._isTouchExplorationEnabled = info.isTouchExplorationEnabled;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED, info);
        }
        if (mobileAccessibility._isHighContrastEnabled !== info.isHighContrastEnabled) {
            mobileAccessibility._isHighContrastEnabled = info.isHighContrastEnabled;
            mobileAccessibility._highContrastScheme = info.highContrastScheme;
            cordova.fireWindowEvent(MobileAccessibilityNotifications.HIGH_CONTRAST_CHANGED, info);
        }
    }
};

/**
 * Error callback for MobileAccessibility start
 */
MobileAccessibility.prototype._error = function(e) {
    console.log("Error initializing MobileAccessibility: " + e);
};

var mobileAccessibility = new MobileAccessibility();

module.exports = mobileAccessibility;
