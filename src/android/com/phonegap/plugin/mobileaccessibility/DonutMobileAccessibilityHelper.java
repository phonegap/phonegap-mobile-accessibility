package com.phonegap.plugin.mobileaccessibility;


import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityManager;
import android.webkit.WebView;

@TargetApi(Build.VERSION_CODES.DONUT)
public class DonutMobileAccessibilityHelper extends
		AbstractMobileAccessibilityHelper {
	protected AccessibilityManager mAccessibilityManager;
	protected WebView mWebView;
	
	@Override
	public void initialize(MobileAccessibility mobileAccessibility) {
		mMobileAccessibility = mobileAccessibility;
		mWebView = mobileAccessibility.webView;
		mParent = mobileAccessibility.webView.getParentForAccessibility();
		mAccessibilityManager = (AccessibilityManager) mMobileAccessibility.cordova.getActivity().getSystemService(Context.ACCESSIBILITY_SERVICE);
	}

	@Override
	public boolean isClosedCaptioningEnabled() {
		return false;
	}

	@Override
	public boolean isScreenReaderRunning() {
		return mAccessibilityManager.isEnabled();
	}

	@Override
	public boolean isTouchExplorationEnabled() {
		return false;
	}

	@Override
	public void onAccessibilityStateChanged(boolean enabled) {
		mMobileAccessibility.onAccessibilityStateChanged(enabled);
	}

	@Override
	public void onCaptioningEnabledChanged(boolean enabled) {
		mMobileAccessibility.onCaptioningEnabledChanged(enabled);
	}

	@Override
	public void onTouchExplorationStateChanged(boolean enabled) {
		mMobileAccessibility.onTouchExplorationStateChanged(enabled);
	}

	@Override
	public void addStateChangeListeners() {
	}

	@Override
	public void removeStateChangeListeners() {
	}
	
	@Override
    public void announceForAccessibility(CharSequence text) {
		if (!mAccessibilityManager.isEnabled()) {
			return;
		}
		
		final int eventType = AccessibilityEvent.TYPE_VIEW_FOCUSED;
		final AccessibilityEvent event = AccessibilityEvent.obtain(eventType);
		event.getText().add(text);
		event.setEnabled(mWebView.isEnabled());
	    event.setClassName(mWebView.getClass().getName());
	    event.setPackageName(mWebView.getContext().getPackageName());
	    event.setContentDescription(null);
	    
	    mAccessibilityManager.sendAccessibilityEvent(event);
    }

}
