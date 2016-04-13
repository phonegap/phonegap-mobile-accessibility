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

#import "CDVMobileAccessibility.h"
#import <Cordova/CDVAvailability.h>
#import <MediaAccessibility/MediaAccessibility.h>

@interface CDVMobileAccessibility ()
    // add any property overrides
    -(double) mGetTextZoom;
    -(void) mSetTextZoom:(double)zoom;
@end

@implementation CDVMobileAccessibility

@synthesize callbackId;
@synthesize commandCallbackId;
@synthesize boldTextEnabled;
@synthesize closedCaptioningEnabled;
@synthesize darkerSystemColorsEnabled;
@synthesize grayscaleEnabled;
@synthesize guidedAccessEnabled;
@synthesize invertColorsEnabled;
@synthesize monoAudioEnabled;
@synthesize reduceMotionEnabled;
@synthesize reduceTransparencyEnabled;
@synthesize speakScreenEnabled;
@synthesize speakSelectionEnabled;
@synthesize switchControlRunning;
@synthesize voiceOverRunning;
@synthesize mFontScale;

#define iOS7Delta (([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0 ) ? 20 : 0 )
#define iOS8Delta (([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0 ) ? 30 : 0 )

// //////////////////////////////////////////////////

- (id)settingForKey:(NSString*)key
{
    return [self.commandDelegate.settings objectForKey:[key lowercaseString]];
}

- (void)pluginInitialize
{
    // SETTINGS ////////////////////////

    NSString* setting = nil;

    setting = @"YourConfigXmlSettingHere";
    if ([self settingForKey:setting]) {
        // set your setting, other init here
    }

    mFontScale = 1;


    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPause) name:UIApplicationDidEnterBackgroundNotification object:nil];

}

// //////////////////////////////////////////////////

- (void)dealloc
{
    [self stop:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
}

- (void)onReset
{
    [self stop:nil];
}

- (void) onPause {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onResume) name:UIApplicationWillEnterForegroundNotification object:nil];
}

- (void)onResume
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPause) name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onApplicationDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
}

- (void)onApplicationDidBecomeActive
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
    [self performSelector:@selector(sendMobileAccessibilityStatusChangedCallback) withObject:nil afterDelay:0.1 ];
}

// //////////////////////////////////////////////////

#pragma Plugin interface

- (void)isBoldTextEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.boldTextEnabled = UIAccessibilityIsBoldTextEnabled();
        } else {
            self.boldTextEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.boldTextEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isClosedCaptioningEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        self.closedCaptioningEnabled = [self getClosedCaptioningEnabledStatus];
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.closedCaptioningEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isDarkerSystemColorsEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.darkerSystemColorsEnabled = UIAccessibilityDarkerSystemColorsEnabled();
        } else {
            self.darkerSystemColorsEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.darkerSystemColorsEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isGrayscaleEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.grayscaleEnabled = UIAccessibilityIsGrayscaleEnabled();
        } else {
            self.grayscaleEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.grayscaleEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isGuidedAccessEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        self.guidedAccessEnabled = UIAccessibilityIsGuidedAccessEnabled();
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.guidedAccessEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isInvertColorsEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        self.invertColorsEnabled = UIAccessibilityIsInvertColorsEnabled();
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.invertColorsEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isMonoAudioEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        self.monoAudioEnabled = UIAccessibilityIsMonoAudioEnabled();
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.monoAudioEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isReduceMotionEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.reduceMotionEnabled = UIAccessibilityIsReduceMotionEnabled();
        } else {
            self.reduceMotionEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.reduceMotionEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isReduceTransparencyEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.reduceTransparencyEnabled = UIAccessibilityIsReduceTransparencyEnabled();
        } else {
            self.reduceTransparencyEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.reduceTransparencyEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isScreenReaderRunning:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        self.voiceOverRunning = UIAccessibilityIsVoiceOverRunning();
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.voiceOverRunning];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isSpeakScreenEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.speakScreenEnabled = UIAccessibilityIsSpeakScreenEnabled();
        } else {
            self.speakScreenEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.speakScreenEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isSpeakSelectionEnabled:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.speakSelectionEnabled = UIAccessibilityIsSpeakSelectionEnabled();
        } else {
            self.speakSelectionEnabled = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.speakSelectionEnabled];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

- (void)isSwitchControlRunning:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if (iOS8Delta) {
            self.switchControlRunning = UIAccessibilityIsSwitchControlRunning();
        } else {
            self.switchControlRunning = false;
        }
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:self.switchControlRunning];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

-(double) mGetFontScale
{
    double fontScale = 1;
    if (iOS7Delta)  {
        fontScale = [[UIFont preferredFontForTextStyle:UIFontTextStyleBody] pointSize] / BASE_UI_FONT_TEXT_STYLE_BODY_POINT_SIZE;
    }
    return fontScale;
}

-(double) mGetTextZoom
{
    double zoom = round(mFontScale * 100);
    // NSLog(@"mGetTextZoom %f%%", zoom);
    return zoom;
}

- (void) getTextZoom:(CDVInvokedUrlCommand *)command
{
    double zoom = [self mGetTextZoom];
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble: zoom];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
}

-(void) mSetTextZoom:(double)zoom
{
    // NSLog(@"mSetTextZoom %f%%'", zoom);
    mFontScale = zoom/100;
    if (iOS7Delta)  {
        NSString *jsString = [[NSString alloc] initWithFormat:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '%f%%'", zoom];
        [self.commandDelegate evalJs:jsString];
    }
}

- (void) setTextZoom:(CDVInvokedUrlCommand *)command
{
    if (command != nil && [command.arguments count] > 0) {
        double zoom = [[command.arguments objectAtIndex:0] doubleValue];
        [self mSetTextZoom:zoom];

        [self.commandDelegate runInBackground:^{
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:zoom];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
}

- (void)updateTextZoom:(CDVInvokedUrlCommand *)command
{
    float fontScale = [self mGetFontScale];
    if (fontScale != mFontScale) {
        mFontScale = fontScale;
    }
    double zoom = [self mGetTextZoom];
    // NSLog(@"updateTextZoom %d%%'", zoom);
    [self mSetTextZoom:zoom];

    if (command != nil && command.callbackId != nil) {
        [self.commandDelegate runInBackground:^{
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:zoom];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }
}

- (void)postNotification:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* result = nil;
    uint32_t notificationType = [[command.arguments objectAtIndex:0] intValue];
    NSString* notificationString = [command.arguments count] > 1 ? [command.arguments objectAtIndex:1] : @"";

    if (notificationString == nil) {
        notificationString = @"";
    }
    if (UIAccessibilityIsVoiceOverRunning() &&
        [self isValidNotificationType:notificationType]) {
        [self.commandDelegate runInBackground:^{
            if (notificationType == UIAccessibilityAnnouncementNotification) {
                self.commandCallbackId = command.callbackId;
                [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityAnnouncementDidFinish:) name:UIAccessibilityAnnouncementDidFinishNotification object:nil];
            }

            UIAccessibilityPostNotification(notificationType, notificationString);

            if (notificationType != UIAccessibilityAnnouncementNotification) {
                NSMutableDictionary* data = [NSMutableDictionary dictionaryWithCapacity:2];
                [data setObject:notificationString forKey:@"stringValue"];
                [data setObject:@"true" forKey:@"wasSuccessful"];
                CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
        }];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}

- (BOOL)isValidNotificationType:(uint32_t)notificationType
{
    return (notificationType == UIAccessibilityScreenChangedNotification
            || notificationType == UIAccessibilityLayoutChangedNotification
            || notificationType == UIAccessibilityAnnouncementNotification
            || notificationType == UIAccessibilityPageScrolledNotification);
}

- (void)mobileAccessibilityAnnouncementDidFinish:(NSNotification *)dict
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityAnnouncementDidFinishNotification object:nil];

    NSString* valueSpoken = [[dict userInfo] objectForKey:UIAccessibilityAnnouncementKeyStringValue];
    NSString* wasSuccessful = [[dict userInfo] objectForKey:UIAccessibilityAnnouncementKeyWasSuccessful];

    NSMutableDictionary* data = [NSMutableDictionary dictionaryWithCapacity:2];
    [data setObject:valueSpoken forKey:@"stringValue"];
    [data setObject:wasSuccessful forKey:@"wasSuccessful"];

    if (self.commandCallbackId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
        [self.commandDelegate sendPluginResult:result callbackId:self.commandCallbackId];
        self.commandCallbackId = nil;
    }
}

- (BOOL)getClosedCaptioningEnabledStatus
{
    BOOL status = false;
    if (&MACaptionAppearanceGetDisplayType) {
        status = (MACaptionAppearanceGetDisplayType(kMACaptionAppearanceDomainUser) > kMACaptionAppearanceDisplayTypeAutomatic);
    } else {
        status = UIAccessibilityIsClosedCaptioningEnabled();
    }
    return status;
}

- (void)mobileAccessibilityStatusChanged:(NSNotification *)notification
{
    [self sendMobileAccessibilityStatusChangedCallback];
}

- (void)sendMobileAccessibilityStatusChangedCallback
{
    if (self.callbackId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getMobileAccessibilityStatus]];
        [result setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }
}

/* Get the current mobile accessibility status. */
- (NSDictionary*)getMobileAccessibilityStatus
{
    self.boldTextEnabled = UIAccessibilityIsBoldTextEnabled();
    self.closedCaptioningEnabled = [self getClosedCaptioningEnabledStatus];
    self.darkerSystemColorsEnabled = UIAccessibilityDarkerSystemColorsEnabled();
    self.grayscaleEnabled = UIAccessibilityIsGrayscaleEnabled();
    self.guidedAccessEnabled = UIAccessibilityIsGuidedAccessEnabled();
    self.invertColorsEnabled = UIAccessibilityIsInvertColorsEnabled();
    self.monoAudioEnabled = UIAccessibilityIsMonoAudioEnabled();
    self.reduceMotionEnabled = UIAccessibilityIsReduceMotionEnabled();
    self.reduceTransparencyEnabled = UIAccessibilityIsReduceTransparencyEnabled();
    self.speakScreenEnabled = UIAccessibilityIsSpeakScreenEnabled();
    self.speakSelectionEnabled = UIAccessibilityIsSpeakSelectionEnabled();
    self.switchControlRunning = UIAccessibilityIsSwitchControlRunning();
    self.voiceOverRunning = UIAccessibilityIsVoiceOverRunning();

    NSMutableDictionary* mobileAccessibilityData = [NSMutableDictionary dictionaryWithCapacity:5];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.boldTextEnabled] forKey:@"isBoldTextEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.closedCaptioningEnabled] forKey:@"isClosedCaptioningEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.darkerSystemColorsEnabled] forKey:@"isDarkerSystemColorsEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.grayscaleEnabled] forKey:@"isGrayscaleEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.guidedAccessEnabled] forKey:@"isGuidedAccessEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.invertColorsEnabled] forKey:@"isInvertColorsEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.monoAudioEnabled] forKey:@"isMonoAudioEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.reduceMotionEnabled] forKey:@"isReduceMotionEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.reduceTransparencyEnabled] forKey:@"isReduceTransparencyEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.speakScreenEnabled] forKey:@"isSpeakScreenEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.speakSelectionEnabled] forKey:@"isSpeakSelectionEnabled"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.switchControlRunning] forKey:@"isSwitchControlRunning"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:self.voiceOverRunning] forKey:@"isScreenReaderRunning"];
    return mobileAccessibilityData;
}


/* start MobileAccessibility monitoring */
- (void)start:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        self.callbackId = command.callbackId;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityClosedCaptioningStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityGuidedAccessStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityInvertColorsStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityMonoAudioStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityVoiceOverStatusChanged object:nil];

        if (iOS8Delta) {
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityBoldTextStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityDarkerSystemColorsStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityGrayscaleStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityReduceMotionStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilityReduceTransparencyStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilitySpeakScreenStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilitySpeakSelectionStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:) name:UIAccessibilitySwitchControlStatusDidChangeNotification object:nil];
        }

        // Update the callback on start
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getMobileAccessibilityStatus]];
        [result setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }];
}

/* stop MobileAccessibility monitoring */
- (void)stop:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        // callback one last time to clear the callback function on JS side
        if (self.callbackId)
        {
            CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getMobileAccessibilityStatus]];
            [result setKeepCallbackAsBool:NO];
            [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
        }
        self.callbackId = nil;
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityClosedCaptioningStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityGuidedAccessStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityInvertColorsStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityAnnouncementDidFinishNotification object:nil];
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityMonoAudioStatusDidChangeNotification object:nil];
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityVoiceOverStatusChanged object:nil];

        if (iOS8Delta) {
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityBoldTextStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityDarkerSystemColorsStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityGrayscaleStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityReduceMotionStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilityReduceTransparencyStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilitySpeakScreenStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilitySpeakSelectionStatusDidChangeNotification object:nil];
            [[NSNotificationCenter defaultCenter] removeObserver:self name:UIAccessibilitySwitchControlStatusDidChangeNotification object:nil];
        }
    }];
}

@end
