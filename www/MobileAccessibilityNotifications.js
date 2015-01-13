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

/**
 * Mobile Accessibility Notification event constants
 */
module.exports = {
    /* MobileAccessibility window events */
    SCREEN_READER_STATUS_CHANGED : "screenreaderstatuschanged",
    CLOSED_CAPTIONING_STATUS_CHANGED : "closedcaptioningstatuschanged",
    GUIDED_ACCESS_STATUS_CHANGED : "guidedaccessstatuschanged",
    INVERT_COLORS_STATUS_CHANGED : "invertcolorsstatuschanged",
    MONO_AUDIO_STATUS_CHANGED : "monoaudiostatuschanged",
    TOUCH_EXPLORATION_STATUS_CHANGED : "touchexplorationstatechanged",

    /* iOS specific UIAccessibilityNotifications  */
    SCREEN_CHANGED : 1000,
    LAYOUT_CHANGED : 1001,
    ANNOUNCEMENT : 1008,
    PAGE_SCROLLED : 1009,

    /* Windows specific high contrast event  */
    HIGH_CONTRAST_CHANGED : "highcontrastchanged"
};
