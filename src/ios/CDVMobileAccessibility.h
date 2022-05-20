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

#import <Cordova/CDVPlugin.h>

static const int BASE_UI_FONT_TEXT_STYLE_BODY_POINT_SIZE = 16;

@interface CDVMobileAccessibility : CDVPlugin {
    NSString* callbackId;
    NSString* commandCallbackId;
    BOOL boldTextEnabled;
    BOOL closedCaptioningEnabled;
    BOOL darkerSystemColorsEnabled;
    BOOL grayscaleEnabled;
    BOOL guidedAccessEnabled;
    BOOL invertColorsEnabled;
    BOOL monoAudioEnabled;
    BOOL reduceMotionEnabled;
    BOOL reduceTransparencyEnabled;
    BOOL speakScreenEnabled;
    BOOL speakSelectionEnabled;
    BOOL switchControlRunning;
    BOOL voiceOverRunning;
}

@property (strong) NSString* callbackId;
@property (strong) NSString* commandCallbackId;
@property BOOL boldTextEnabled;
@property BOOL closedCaptioningEnabled;
@property BOOL darkerSystemColorsEnabled;
@property BOOL grayscaleEnabled;
@property BOOL guidedAccessEnabled;
@property BOOL invertColorsEnabled;
@property BOOL monoAudioEnabled;
@property BOOL reduceMotionEnabled;
@property BOOL reduceTransparencyEnabled;
@property BOOL speakScreenEnabled;
@property BOOL speakSelectionEnabled;
@property BOOL switchControlRunning;
@property BOOL voiceOverRunning;
@property double mFontScale;


- (void) isBoldTextEnabled:(CDVInvokedUrlCommand*)command;
- (void) isClosedCaptioningEnabled:(CDVInvokedUrlCommand*)command;
- (void) isDarkerSystemColorsEnabled:(CDVInvokedUrlCommand*)command;
- (void) isGrayscaleEnabled:(CDVInvokedUrlCommand*)command;
- (void) isGuidedAccessEnabled:(CDVInvokedUrlCommand*)command;
- (void) isInvertColorsEnabled:(CDVInvokedUrlCommand*)command;
- (void) isMonoAudioEnabled:(CDVInvokedUrlCommand*)command;
- (void) isReduceMotionEnabled:(CDVInvokedUrlCommand*)command;
- (void) isReduceTransparencyEnabled:(CDVInvokedUrlCommand*)command;
- (void) isScreenReaderRunning:(CDVInvokedUrlCommand*)command;
- (void) isSpeakScreenEnabled:(CDVInvokedUrlCommand*)command;
- (void) isSpeakSelectionEnabled:(CDVInvokedUrlCommand*)command;
- (void) isSwitchControlRunning:(CDVInvokedUrlCommand*)command;
- (void) getTextZoom:(CDVInvokedUrlCommand*)command;
- (void) setTextZoom:(CDVInvokedUrlCommand*)command;
- (void) updateTextZoom:(CDVInvokedUrlCommand*)command;
- (void) postNotification:(CDVInvokedUrlCommand*)command;
- (void) start:(CDVInvokedUrlCommand*)command;
- (void) stop:(CDVInvokedUrlCommand*)command;

@end