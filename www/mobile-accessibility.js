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
    exec = require('cordova/exec');

var MobileAccessibility = function() {
    this._isScreenReaderRunning = false;
    this._isClosedCaptioningEnabled = false;
    this._isGuidedAccessEnabled = false;
    this._isInvertColorsEnabled = false;
    this._isMonoAudioEnabled = false;
    // Create new event handlers on the window (returns a channel instance)
    this.channels = {
        screenreaderstatuschanged:cordova.addWindowEventHandler("screenreaderstatuschanged"),
        closedcaptioningstatusdidchange:cordova.addWindowEventHandler("closedcaptioningstatusdidchange"),
        guidedaccessstatusdidchange:cordova.addWindowEventHandler("guidedaccessstatusdidchange"),
        invertcolorsstatusdidchange:cordova.addWindowEventHandler("invertcolorsstatusdidchange"),
        monoaudiostatusdidchange:cordova.addWindowEventHandler("monoaudiostatusdidchange")
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
           mobileAccessibility.channels.closedcaptioningstatusdidchange.numHandlers +
           mobileAccessibility.channels.invertcolorsstatusdidchange.numHandlers +
           mobileAccessibility.channels.monoaudiostatusdidchange.numHandlers +
           mobileAccessibility.channels.guidedaccessstatusdidchange.numHandlers;
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
    exec(callback, null, "MobileAccessibility", "isScreenReaderRunning", []);
};
MobileAccessibility.prototype.isVoiceOverRunning = MobileAccessibility.prototype.isScreenReaderRunning;

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
 * Callback from native MobileAccessibility returning an which describes the status of MobileAccessibility features.
 *
 * @param {Object} info
 * @config {Boolean} [isScreenReaderRunning] Boolean to indicate screen reader status.
 * @config {Boolean} [isClosedCaptioningEnabled] Boolean to indicate closed captioning status.
 * @config {Boolean} [isGuidedAccessEnabled] Boolean to indicate guided access status.
 * @config {Boolean} [isInvertColorsEnabled] Boolean to indicate invert colors status.
 * @config {Boolean} [isMonoAudioEnabled] Boolean to indicate mono audio status.
 */
MobileAccessibility.prototype._status = function(info) {
    if (info) {
        if (mobileAccessibility._isScreenReaderRunning !== info.isScreenReaderRunning) {
            cordova.fireWindowEvent("screenreaderstatuschanged", info);
            mobileAccessibility._isScreenReaderRunning = info.isScreenReaderRunning;
        }
        if (mobileAccessibility._isClosedCaptioningEnabled !== info.isClosedCaptioningEnabled) {
            cordova.fireWindowEvent("closedcaptioningstatusdidchange", info);
            mobileAccessibility._isClosedCaptioningEnabled = info.isClosedCaptioningEnabled;
        }
        if (mobileAccessibility._isGuidedAccessEnabled !== info.isGuidedAccessEnabled) {
            cordova.fireWindowEvent("guidedaccessstatusdidchange", info);
            mobileAccessibility._isGuidedAccessEnabled = info.isGuidedAccessEnabled;
        }
        if (mobileAccessibility._isInvertColorsEnabled !== info.isInvertColorsEnabled) {
            cordova.fireWindowEvent("invertcolorsstatusdidchange", info);
            mobileAccessibility._isInvertColorsEnabled = info.isInvertColorsEnabled;
        }
        if (mobileAccessibility._isMonoAudioEnabled !== info.isMonoAudioEnabled) {
           cordova.fireWindowEvent("monoaudiostatusdidchange", info);
           mobileAccessibility._isMonoAudioEnabled = info.isMonoAudioEnabled;
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
