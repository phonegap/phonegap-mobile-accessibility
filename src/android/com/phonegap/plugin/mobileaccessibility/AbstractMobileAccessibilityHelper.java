package com.phonegap.plugin.mobileaccessibility;

import android.view.ViewParent;

public abstract class AbstractMobileAccessibilityHelper {
	protected MobileAccessibility mMobileAccessibility;
	protected ViewParent mParent;
	public abstract void initialize(MobileAccessibility mobileAccessibility);
	public abstract boolean isClosedCaptioningEnabled();
	public abstract boolean isScreenReaderRunning();
	public abstract boolean isTouchExplorationEnabled();
	public abstract void onAccessibilityStateChanged(boolean enabled);
	public abstract void onCaptioningEnabledChanged(boolean enabled);
	public abstract void onTouchExplorationStateChanged(boolean enabled);
	public abstract void addStateChangeListeners();
	public abstract void removeStateChangeListeners();
	public abstract void announceForAccessibility(CharSequence text);
}
