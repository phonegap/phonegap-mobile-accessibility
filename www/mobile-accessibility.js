/*
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
    device = require('org.apache.cordova.device.device'),
    network = require('org.apache.cordova.network-information.network'),
    connection = require('org.apache.cordova.network-information.Connection');

var MobileAccessibility = function() {
    this._isScreenReaderRunning = false;
    this._isClosedCaptioningEnabled = false;
    this._isGuidedAccessEnabled = false;
    this._isInvertColorsEnabled = false;
    this._isMonoAudioEnabled = false;
    this._isTouchExplorationEnabled = false;
    // Create new event handlers on the window (returns a channel instance)
    this.channels = {
        screenreaderstatuschanged:cordova.addWindowEventHandler("screenreaderstatuschanged"),
        closedcaptioningstatuschanged:cordova.addWindowEventHandler("closedcaptioningstatuschanged"),
        guidedaccessstatuschanged:cordova.addWindowEventHandler("guidedaccessstatuschanged"),
        invertcolorsstatuschanged:cordova.addWindowEventHandler("invertcolorsstatuschanged"),
        monoaudiostatuschanged:cordova.addWindowEventHandler("monoaudiostatuschanged"),
        touchexplorationstatechanged:cordova.addWindowEventHandler("touchexplorationstatechanged")
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
    return mobileAccessibility.channels.screenreaderstatuschanged.numHandlers +
           mobileAccessibility.channels.closedcaptioningstatuschanged.numHandlers +
           mobileAccessibility.channels.invertcolorsstatuschanged.numHandlers +
           mobileAccessibility.channels.monoaudiostatuschanged.numHandlers +
           mobileAccessibility.channels.guidedaccessstatuschanged.numHandlers +
           mobileAccessibility.channels.touchexplorationstatechanged.numHandlers;
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
MobileAccessibility.prototype.isVoiceOverRunning = MobileAccessibility.prototype.isScreenReaderRunning;
MobileAccessibility.prototype.isTalkBackRunning = MobileAccessibility.prototype.isScreenReaderRunning;
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
 * Asynchronous call to native MobileAccessibility to determine if closed captioning is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isClosedCaptioningEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isClosedCaptioningEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if the display colors have been inverted.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isInvertColorsEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isInvertColorsEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if mono audio is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isMonoAudioEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isMonoAudioEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Guided Access is enabled.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isGuidedAccessEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isGuidedAccessEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to determine if Touch Exploration is enabled on Android.
 * @param {function} callback A callback method to receive the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isTouchExplorationEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isTouchExplorationEnabled", []);
};

MobileAccessibility.prototype.MobileAccessibilityNotifications = {
    SCREEN_CHANGED : 1000,
    LAYOUT_CHANGED : 1001,
    ANNOUNCEMENT : 1008,
    PAGE_SCROLLED : 1009
}
               
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
		exec(null, null, "MobileAccessibility", "postNotification", [mobileAccessibility.MobileAccessibilityNotifications.ANNOUNCEMENT, string]);
	}
}

/**
 * Stops speech.
 */
MobileAccessibility.prototype.stop = function() {
	if (this.isChromeVoxActive()) {
		cvox.ChromeVox.tts.stop();
	} else {
		exec(null, null, "MobileAccessibility", "postNotification", [mobileAccessibility.MobileAccessibilityNotifications.ANNOUNCEMENT]);
	}
}

/**
 * Callback from native MobileAccessibility returning an which describes the status of MobileAccessibility features.
 *
 * @param {Object} info
 * @config {Boolean} [isScreenReaderRunning] Boolean to indicate screen reader status.
 * @config {Boolean} [isClosedCaptioningEnabled] Boolean to indicate closed captioning status.
 * @config {Boolean} [isGuidedAccessEnabled] Boolean to indicate guided access status (ios).
 * @config {Boolean} [isInvertColorsEnabled] Boolean to indicate invert colors status (ios).
 * @config {Boolean} [isMonoAudioEnabled] Boolean to indicate mono audio status (ios).
 * @config {Boolean} [isTouchExplorationEnabled] Boolean to indicate touch exploration status (android).
 */
MobileAccessibility.prototype._status = function(info) {
    if (info) {
    	mobileAccessibility.activateOrDeactivateChromeVox(info.isScreenReaderRunning);
    	if (mobileAccessibility._isScreenReaderRunning !== info.isScreenReaderRunning) {	
            mobileAccessibility._isScreenReaderRunning = info.isScreenReaderRunning;
        	cordova.fireWindowEvent("screenreaderstatuschanged", info);
        }
        if (mobileAccessibility._isClosedCaptioningEnabled !== info.isClosedCaptioningEnabled) {
            mobileAccessibility._isClosedCaptioningEnabled = info.isClosedCaptioningEnabled;
            cordova.fireWindowEvent("closedcaptioningstatuschanged", info);
        }
        if (mobileAccessibility._isGuidedAccessEnabled !== info.isGuidedAccessEnabled) {
            mobileAccessibility._isGuidedAccessEnabled = info.isGuidedAccessEnabled;
            cordova.fireWindowEvent("guidedaccessstatuschanged", info);
        }
        if (mobileAccessibility._isInvertColorsEnabled !== info.isInvertColorsEnabled) {
            mobileAccessibility._isInvertColorsEnabled = info.isInvertColorsEnabled;
            cordova.fireWindowEvent("invertcolorsstatuschanged", info);
        }
        if (mobileAccessibility._isMonoAudioEnabled !== info.isMonoAudioEnabled) {
           mobileAccessibility._isMonoAudioEnabled = info.isMonoAudioEnabled;
           cordova.fireWindowEvent("monoaudiostatuschanged", info);
        }
        if (mobileAccessibility._isTouchExplorationEnabled !== info.isTouchExplorationEnabled) {
            mobileAccessibility._isTouchExplorationEnabled = info.isTouchExplorationEnabled;
            cordova.fireWindowEvent("touchexplorationstatechanged", info);
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
