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
    // since this is ARC, remove observers only
}

// //////////////////////////////////////////////////

#pragma Plugin interface

- (void) isVoiceOverRunning:(CDVInvokedUrlCommand*)command
{
	// TODO:
}

@end
