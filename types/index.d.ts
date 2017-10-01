// Type definitions for phonegap-plugin-mobile-accessibility
// Project: https://github.com/phonegap/phonegap-mobile-accessibility


// https://github.com/phonegap/phonegap-mobile-accessibility/blob/master/www/MobileAccessibilityNotifications.js
declare const MobileAccessibilityNotifications = {
    /* MobileAccessibility window events */
    SCREEN_READER_STATUS_CHANGED : "screenreaderstatuschanged",
    CLOSED_CAPTIONING_STATUS_CHANGED : "closedcaptioningstatuschanged",
    GUIDED_ACCESS_STATUS_CHANGED : "guidedaccessstatuschanged",
    INVERT_COLORS_STATUS_CHANGED : "invertcolorsstatuschanged",
    MONO_AUDIO_STATUS_CHANGED : "monoaudiostatuschanged",
    REDUCE_MOTION_STATUS_CHANGED : "reducemotionstatuschanged",
    TOUCH_EXPLORATION_STATUS_CHANGED : "touchexplorationstatechanged",
    BOLD_TEXT_STATUS_CHANGED : "boldtextstatuschanged",
    DARKER_SYSTEM_COLORS_STATUS_CHANGED : "darkersystemcolorsstatuschanged",
    GRAYSCALE_STATUS_CHANGED : "grayscalestatuschanged",
    REDUCE_TRANSPARENCY_STATUS_CHANGED : "reducetransparencystatuschanged",
    SPEAK_SCREEN_STATUS_CHANGED : "speakscreenstatuschanged",
    SPEAK_SELECTION_STATUS_CHANGED : "speakselectionstatuschanged",
    SWITCH_CONTROL_STATUS_CHANGED : "switchcontrolstatuschanged",

    /* iOS specific UIAccessibilityNotifications  */
    SCREEN_CHANGED : 1000,
    LAYOUT_CHANGED : 1001,
    ANNOUNCEMENT : 1008,
    PAGE_SCROLLED : 1009,

    /* Windows specific high contrast event  */
    HIGH_CONTRAST_CHANGED : "highcontrastchanged"
};

interface MobileAccessibilityNotificationsEventMap {
    "boldtextstatuschanged": { isBoldTextEnabled?: boolean };
    "closedcaptioningstatuschanged": { isClosedCaptioningEnabled?: boolean };
    "darkersystemcolorsstatuschanged": { isDarkerSystemColorsEnabled?: boolean };
    "grayscalestatuschanged": { isGrayscaleEnabled?: boolean };
    "guidedaccessstatuschanged": { isGuidedAccessEnabled?: boolean };
    "invertcolorsstatuschanged": { isInvertColorsEnabled?: boolean };
    "monoaudiostatuschanged": { isMonoAudioEnabled?: boolean };
    "reducemotionstatuschanged": { isReduceMotionEnabled?: boolean };
    "reducetransparencystatuschanged": { isReduceTransparencyEnabled?: boolean };
    "screenreaderstatuschanged": { isScreenReaderRunning?: boolean };
    "speakscreenstatuschanged": { isSpeakScreenEnabled?: boolean };
    "speakselectionstatuschanged": { isSpeakSelectionEnabled?: boolean };
    "switchcontrolstatuschanged": { isSwitchControlRunning?: boolean };
    "touchexplorationstatuschanged": { isTouchExplorationEnabled?: boolean };
}

interface Window {
    MobileAccessibility: MobileAccessibility;
    addEventListener<K extends keyof MobileAccessibilityNotificationsEventMap>(
        type: K,
        listener: (info: undefined | MobileAccessibilityNotificationsEventMap[K]) => any
    ): void;
}

interface MobileAccessibility {
    isScreenReaderRunning(cb: (yes: boolean) => void): void;

    /** iOS only */
    isVoiceOverRunning(cb: (yes: boolean) => void): void;

    /** android only */
    isTalkBackRunning(cb: (yes: boolean) => void): void;

    /** android only */
    isChromeVoxActive(): boolean;

    /** iOS only */
    isBoldTextEnabled(cb: (yes: boolean) => void): void;

    isClosedCaptioningEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isDarkerSystemColorsEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isGrayscaleEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isGuidedAccessEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isInvertColorsEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isMonoAudioEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isReduceMotionEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isReduceTransparencyEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isSpeakScreenEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isSpeakSelectionEnabled(cb: (yes: boolean) => void): void;

    /** iOS only */
    isSwitchControlRunning(cb: (yes: boolean) => void): void;

    /** android only */
    isTouchExplorationEnabled(cb: (yes: boolean) => void): void;

    getTextZoom(cb: (textZoom: number) => void): void;
    setTextZoom(textZoom: number, cb: (textZoom: number) => void): void;
    updateTextZoom(cb: (textZoom: number) => void): void;
    usePreferredTextZoom(usePreferredTextZoom: boolean): void;

    /** iOS only */
    postNotification(mobileAccessibilityNotification:
                         typeof MobileAccessibilityNotifications.SCREEN_CHANGED |
                         typeof MobileAccessibilityNotifications.LAYOUT_CHANGED |
                         typeof MobileAccessibilityNotifications.ANNOUNCEMENT |
                         typeof MobileAccessibilityNotifications.PAGE_SCROLLED,
                     s: string,
                     callback: (info: undefined | {stringValue: string; wasSuccessful: boolean}) => void): void;

    /**
     * @param {string} s A string to be announced by a screen reader.
     * @param {0 | 1} queueMode Valid modes are 0 for flush; 1 for queue.
     * @param {Object} properties Speech properties to use for this utterance.
     */
    speak(s: string, queueMode?: 0 | 1, properties?: object): void;

    /** Stops speech */
    stop(): void;
}
