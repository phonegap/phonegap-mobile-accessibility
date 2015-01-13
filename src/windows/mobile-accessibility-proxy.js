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

/*global Windows:true*/

var cordova = require('cordova'),
    accessibilitySettings,
    uiSettings,
    callbackContext,
    fontScale = 1,
    styleElement,
    bodyStyleDeclaration,
    audio,
    synth;

function getAccessibilitySettings() {
    if (!accessibilitySettings) {
        accessibilitySettings = new Windows.UI.ViewManagement.AccessibilitySettings();
    }
    return accessibilitySettings;
}

function getUISettings() {
    if (!uiSettings) {
        uiSettings = new Windows.UI.ViewManagement.UISettings();
    }
    return uiSettings;
}

function getFontScale() {
    if (!uiSettings) {
        uiSettings = getUISettings();
    }
    var scale = uiSettings.textScaleFactor;
    // console.log("getFontScale " + scale);
    return scale;
}

function getTextZoom() {
    var zoom = Math.round(fontScale * 100);
    // console.log("getTextZoom " + zoom);
    return zoom;
}

function createStyleElement() {
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.type = "text/css";
        document.head.appendChild(styleElement);
    }
}

function setTextZoom(zoom) {
    // console.log("setTextZoom " + zoom);
    fontScale = zoom/100;

    createStyleElement();

    if (bodyStyleDeclaration) {
        styleElement.removeChild(bodyStyleDeclaration);
    }

    bodyStyleDeclaration = document.createTextNode("body {-ms-text-size-adjust: " + zoom + "%}");

    styleElement.appendChild(bodyStyleDeclaration);
}

function onHighContrastChanged(event) {
    cordova.fireWindowEvent(MobileAccessibilityNotifications.HIGH_CONTRAST_CHANGED,
                            getMobileAccessibilityStatus());
    sendMobileAccessibilityStatusChangedCallback();
}

function sendMobileAccessibilityStatusChangedCallback() {
    console.log("sendMobileAccessibilityStatusChangedCallback");
    if (callbackContext && typeof callbackContext === "function") {
        callbackContext(getMobileAccessibilityStatus());
    }
}

function getMobileAccessibilityStatus() {
    return {
        isScreenReaderRunning: false,
        isClosedCaptioningEnabled: false,
        isHighContrastEnabled: accessibilitySettings.highContrast,
        highContrastScheme: (accessibilitySettings.highContrast ? accessibilitySettings.highContrastScheme : undefined)
    };
}

module.exports = {
    start:function(win, fail, args) {
        if (typeof win === "function") {
            callbackContext = win;
        }
        if (!accessibilitySettings) {
            accessibilitySettings = getAccessibilitySettings();
        }
        accessibilitySettings.addEventListener("highcontrastchanged", onHighContrastChanged);

        if (!uiSettings) {
            uiSettings = getUISettings();
        }
    },
    stop:function(win, fail, args) {
        if (accessibilitySettings) {
            accessibilitySettings.removeEventListener("highcontrastchanged", onHighContrastChanged);
        }

        if (synth) {
            synth.close();
            synth = null;
        }

        if (audio) {
            audio = null;
        }

        if (callbackContext) {
            callbackContext = null;
        }
    },
    isScreenReaderRunning:function(win, fail, args) {
        console && console.error && console.error("Error : Windows 8.1 does not yet have a way to detect that Narrator is running.");
        fail && setTimeout(function() {
            fail(new Error("Windows Phone 8.1 does not yet have a way to detect that Narrator is running."));
        }, 0);
        if (win && typeof win === "function") {
           win(false);
        }
    },
    isClosedCaptioningEnabled:function(win, fail, args) {
        console && console.error && console.error("Error : MobileAccessibility.isClosedCaptioningEnabled is not yet implemented on Windows 8.1.");
        fail && setTimeout(function() {
            fail(new Error("MobileAccessibility.isClosedCaptioningEnabled is not yet implemented on Windows 8.1."));
        }, 0);
        if (win && typeof win === "function") {
           win(false);
        }
    },
    isHighContrastEnabled:function(win, fail, args) {
        if (!accessibilitySettings) {
            accessibilitySettings = getAccessibilitySettings();
        }

        if (win && typeof win === "function") {
            win(accessibilitySettings.highContrast);
        }
        return accessibilitySettings.highContrast;
    },
    getHighContrastScheme:function(win, fail, args) {
        if (!accessibilitySettings) {
            accessibilitySettings = getAccessibilitySettings();
        }

        var highContrastScheme = accessibilitySettings.highContrast ? accessibilitySettings.highContrastScheme : undefined;

        if (win) {
            win(highContrastScheme);
        }
        return highContrastScheme;
    },
    getTextZoom:function(win, fail, args) {
        var zoom =  Math.round(fontScale * 100);

        if (win) {
            win(zoom);
        }

        return zoom;
    },
    setTextZoom:function(win, fail, args) {
        var zoom = args[0];
        setTextZoom(args[0]);

        if (win) {
            win(zoom);
        }

        return zoom;
    },
    updateTextZoom:function(win, fail, args) {
        var scale = getFontScale(),
            zoom;
        if (scale !== fontScale) {
            fontScale = scale;
        }
        zoom = getTextZoom();
        setTextZoom(zoom);

        if (win) {
            win(zoom);
        }

        return zoom;
    },
    postNotification:function(win, fail, args) {
        var str = args[1];

        if (str && typeof str === "string") {
            // The object for controlling and playing audio.
            if (!audio) {
                audio = new Audio();
            } else if (audio.pause) {
                audio.pause();
                audio.src = null;
            }

            // The object for controlling the speech synthesis engine (voice).
            if (!synth) {
                synth = new Windows.Media.SpeechSynthesis.SpeechSynthesizer();
            }

            if (str && str.length && str !== "\u200b") {

                // Generate the audio stream from plain text.
                synth.synthesizeTextToStreamAsync(str).then(function (markersStream) {

                    // Convert the stream to a URL Blob.
                    var blob = MSApp.createBlobFromRandomAccessStream(markersStream.contentType, markersStream);
                    // Send the Blob to the audio object.
                    audio.src = URL.createObjectURL(blob, { oneTimeOnly: true });
                    // Start at beginning when speak is hit
                    markersStream.seek(0);
                    audio.AutoPlay = Boolean(true);

                    // Audio on completed
                    audio.onended = function () {
                        if (win) {
                            win({
                                stringValue: str,
                                wasSuccessful: true
                            });
                        }
                    };

                    audio.play();
                });
            }
        }
    }
};

require("cordova/exec/proxy").add("MobileAccessibility", module.exports);
