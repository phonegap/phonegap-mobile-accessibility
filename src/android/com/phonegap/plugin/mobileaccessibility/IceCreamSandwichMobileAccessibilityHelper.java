package com.phonegap.plugin.mobileaccessibility;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.annotation.TargetApi;
import android.os.Build;
import android.util.Log;
import android.view.accessibility.AccessibilityManager.AccessibilityStateChangeListener;

@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
public class IceCreamSandwichMobileAccessibilityHelper extends
		DonutMobileAccessibilityHelper {
	protected AccessibilityStateChangeListener mAccessibilityStateChangeListener;
	
	@Override
	public boolean isScreenReaderRunning() {		
		return mAccessibilityManager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_SPOKEN).size() > 0;
	}
	
	@Override
	public void addStateChangeListeners() {
		if (mAccessibilityStateChangeListener == null) {
			mAccessibilityStateChangeListener = new InternalAccessibilityStateChangeListener();
		}
		mAccessibilityManager.addAccessibilityStateChangeListener(mAccessibilityStateChangeListener);
	}
	
	@Override
	public void removeStateChangeListeners() {
		mAccessibilityManager.removeAccessibilityStateChangeListener(mAccessibilityStateChangeListener);
		mAccessibilityStateChangeListener = null;
	}
	
	@Override
	public int getTextZoom() {
		return mWebView.getSettings().getTextZoom();
	}
	
	@Override
	public void setTextZoom(int textZoom) {
		final int zoom = textZoom;
		//Log.i("MobileAccessibility", "setTextZoom(" + zoom + ")");
		mWebView.getSettings().setTextZoom(zoom);
	}
	
	protected class InternalAccessibilityStateChangeListener 
		implements AccessibilityStateChangeListener {
		
		@Override
		public void onAccessibilityStateChanged(boolean enabled) {
			mMobileAccessibility.onAccessibilityStateChanged(enabled);
		}
	}
}
