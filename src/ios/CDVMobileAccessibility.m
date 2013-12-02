/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVMobileAccessibility.h"
#import <Cordova/CDVAvailability.h>

@interface CDVMobileAccessibility ()
// add any property overrides
@end

@implementation CDVMobileAccessibility

@synthesize callbackId;

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
}

// //////////////////////////////////////////////////

- (void)dealloc
{
    [self stop:nil];
}

- (void)onReset
{
    [self stop:nil];
}

// //////////////////////////////////////////////////

#pragma Plugin interface

- (void)isVoiceOverRunning:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:UIAccessibilityIsVoiceOverRunning()];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)isClosedCaptioningEnabled:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:UIAccessibilityIsClosedCaptioningEnabled()];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}


- (void)mobileAccessibilityStatusChanged:(NSNotification *)notification
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
    NSMutableDictionary* mobileAccessibilityData = [NSMutableDictionary dictionaryWithCapacity:2];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:UIAccessibilityIsVoiceOverRunning()] forKey:@"isVoiceOverRunning"];
    [mobileAccessibilityData setObject:[NSNumber numberWithBool:UIAccessibilityIsClosedCaptioningEnabled()] forKey:@"isClosedCaptioningEnabled"];
    return mobileAccessibilityData;
}


/* turn on MobileAccessibility monitoring*/
- (void)start:(CDVInvokedUrlCommand*)command
{
    self.callbackId = command.callbackId;
        
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:)
        name:UIAccessibilityVoiceOverStatusChanged object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(mobileAccessibilityStatusChanged:)
        name:UIAccessibilityClosedCaptioningStatusDidChangeNotification object:nil];
}

- (void)stop:(CDVInvokedUrlCommand*)command
{
    // callback one last time to clear the callback function on JS side
    if (self.callbackId)
    {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getMobileAccessibilityStatus]];
        [result setKeepCallbackAsBool:NO];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }
    self.callbackId = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self
        name:UIAccessibilityVoiceOverStatusChanged object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
        name:UIAccessibilityClosedCaptioningStatusDidChangeNotification object:nil];
}

@end
