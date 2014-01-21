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
    this._isVoiceOverRunning = false;
    this._isClosedCaptioningEnabled = false;
    this._isGuidedAccessEnabled = false;
    this._isInvertColorsEnabled = false;
    this._isMonoAudioEnabled = false;
    // Create new event handlers on the window (returns a channel instance)
    this.channels = {
        voiceoverstatuschanged:cordova.addWindowEventHandler("voiceoverstatuschanged"),
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
    return mobileAccessibility.channels.voiceoverstatuschanged.numHandlers +
           mobileAccessibility.channels.closedcaptioningstatusdidchange.numHandlers +
           mobileAccessibility.channels.invertcolorsstatusdidchange.numHandlers +
           mobileAccessibility.channels.monoaudiostatusdidchange.numHandlers +
           mobileAccessibility.channels.guidedaccessstatusdidchange.numHandlers;
};

/**
 *
 * Event handlers for when callbacks get registered for mobileAccessibility.
 * Keep track of how many handlers we have so we can start and stop the native MobileAccessibility listener
 * appropriately.
 * @private
 * @ignore
 */
MobileAccessibility.onHasSubscribersChange = function() {
    // If we just registered the first handler, make sure native listener is started.
    if (this.numHandlers === 1 && handlers() === 1) {
               console.log("MobileAccessibility.onHasSubscribersChange "+handlers());
        exec(mobileAccessibility._status, mobileAccessibility._error, "MobileAccessibility", "start", []);
    } else if (handlers() === 0) {
        exec(null, null, "MobileAccessibility", "stop", []);
    }
};

/**
 * Asynchronous call to native MobileAccessibility detemine if VoiceOver is running.
 * @param {function} callback A callback method to recieve the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isVoiceOverRunning = function(callback) {
    exec(callback, null, "MobileAccessibility", "isVoiceOverRunning", []);
};

/**
 * Asynchronous call to native MobileAccessibility to detemine if closed captioning is enabled.
 * @param {function} callback A callback method to recieve the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isClosedCaptioningEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isClosedCaptioningEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to detemine if the display colors have been inverted.
 * @param {function} callback A callback method to recieve the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isInvertColorsEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isInvertColorsEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to detemine if mono audio is enabled.
 * @param {function} callback A callback method to recieve the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isMonoAudioEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isMonoAudioEnabled", []);
};

/**
 * Asynchronous call to native MobileAccessibility to detemine if Guided Access is enabled.
 * @param {function} callback A callback method to recieve the asynchronous result from the native MobileAccessibility.
 */
MobileAccessibility.prototype.isGuidedAccessEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isGuidedAccessEnabled", []);
};

/**
 * Posts an announcement notification with a string for VoiceOver to announce, if it is running.
 * @param {string} string A string to be announced by VoiceOver.
 * @param {function} callback A callback method to recieve the asynchronous result from the native MobileAccessibility, when the announcement is finished, the function should expect an object containing the stringValue that was voiced and a boolean indicating that the announcement wasSuccessful.
 */
MobileAccessibility.prototype.postAnnouncementNotification = function(string, callback) {
    exec(callback, null, "MobileAccessibility", "postAnnouncementNotification", [string]);
};

/**
 * Callback from native MobileAccessibility returning an which describes the status of iOS accessibility features.
 *
 * @param {Object} info
 * @config {Boolean} [isVoiceOverRunning] Boolean to indicate VoiceOver status.
 * @config {Boolean} [isClosedCaptioningEnabled] Boolean to indicate closed captioning status.
 * @config {Boolean} [isGuidedAccessEnabled] Boolean to indicate guided access status.
 * @config {Boolean} [isInvertColorsEnabled] Boolean to indicate invert colors status.
 * @config {Boolean} [isMonoAudioEnabled] Boolean to indicate mono audio status.
 */
MobileAccessibility.prototype._status = function(info) {
    if (info) {
        if (mobileAccessibility._isVoiceOverRunning !== info.isVoiceOverRunning) {
            cordova.fireWindowEvent("voiceoverstatuschanged", info);
            mobileAccessibility._isVoiceOverRunning = info.isVoiceOverRunning;
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
