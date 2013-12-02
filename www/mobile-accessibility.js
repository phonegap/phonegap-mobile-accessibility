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
    // Create new event handlers on the window (returns a channel instance)
    this.channels = {
        voiceoverstatuschanged:cordova.addWindowEventHandler("voiceoverstatuschanged"),
        closedcaptioningstatusdidchange:cordova.addWindowEventHandler("closedcaptioningstatusdidchange")
    };
    for (var key in this.channels) {
        this.channels[key].onHasSubscribersChange = MobileAccessibility.onHasSubscribersChange;
    }
};

function handlers() {
    return mobileAccessibility.channels.voiceoverstatuschanged.numHandlers +
           mobileAccessibility.channels.closedcaptioningstatusdidchange.numHandlers;
};

/**
 * Event handlers for when callbacks get registered for mobileAccessibility.
 * Keep track of how many handlers we have so we can start and stop the native MobileAccessibility listener
 * appropriately.
 */
MobileAccessibility.onHasSubscribersChange = function() {
    // If we just registered the first handler, make sure native listener is started.
    if (this.numHandlers === 1 && handlers() === 1) {
        exec(mobileAccessibility._status, mobileAccessibility._error, "MobileAccessibility", "start", []);
    } else if (handlers() === 0) {
        exec(null, null, "MobileAccessibility", "stop", []);
    }
};

MobileAccessibility.prototype.isVoiceOverRunning = function(callback) {
    exec(callback, null, "MobileAccessibility", "isVoiceOverRunning", []);
};

MobileAccessibility.prototype.isClosedCaptioningEnabled = function(callback) {
    exec(callback, null, "MobileAccessibility", "isClosedCaptioningEnabled", []);
};

/**
 * Callback for mobileAccessibility status
 *
 * @param {Object} info keys: isVoiceOverRunning, isClosedCaptioningEnabled
 */
MobileAccessibility.prototype._status = function(info) {
    if (info) {
        var me = mobileAccessibility;
        if (me._isVoiceOverRunning !== info.isVoiceOverRunning) {
            cordova.fireWindowEvent("voiceoverstatuschanged", info);
            me._isVoiceOverRunning = info.isVoiceOverRunning;
        }
        if (me._isClosedCaptioningEnabled !== info.isClosedCaptioningEnabled) {
            cordova.fireWindowEvent("closedcaptioningstatusdidchange", info);
            me._isClosedCaptioningEnabled = info.isClosedCaptioningEnabled;
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
start