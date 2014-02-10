package com.phonegap.plugin.mobileaccessibility;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.annotation.TargetApi;
import android.content.Context;
import android.view.accessibility.AccessibilityManager.TouchExplorationStateChangeListener;
import android.view.accessibility.CaptioningManager;
import android.view.accessibility.CaptioningManager.CaptioningChangeListener;

@TargetApi(19)
public class KitKatMobileAccessibilityHelper extends
		JellyBeanMobileAccessibilityHelper {
	protected CaptioningManager mCaptioningManager;
	protected CaptioningChangeListener mCaptioningChangeListener;
	protected TouchExplorationStateChangeListener mTouchExplorationStateChangeListener;
	
	@Override
	public void initialize(MobileAccessibility mobileAccessibility) {
		super.initialize(mobileAccessibility);
		mCaptioningManager = (CaptioningManager) mobileAccessibility.cordova.getActivity().getSystemService(Context.CAPTIONING_SERVICE);
	}
	
	@Override
	public boolean isScreenReaderRunning() {		
		return mAccessibilityManager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_BRAILLE | AccessibilityServiceInfo.FEEDBACK_SPOKEN).size() > 0;
	}

	@Override
	public boolean isClosedCaptioningEnabled() {
		return mCaptioningManager.isEnabled();
	}

	@Override
	public boolean isTouchExplorationEnabled() {
		return mAccessibilityManager.isTouchExplorationEnabled();
	}
	
	@Override
	public void addStateChangeListeners() {
		super.addStateChangeListeners();
		if (mCaptioningChangeListener == null) {
			mCaptioningChangeListener = new CaptioningChangeListener() {
		        /** @hide */
		        @Override
		        public void onEnabledChanged(boolean enabled) {
		            onCaptioningEnabledChanged(enabled);
		        }
			};
		}
		mCaptioningManager.addCaptioningChangeListener(mCaptioningChangeListener);
		
		if (mTouchExplorationStateChangeListener == null) {
			mTouchExplorationStateChangeListener = new InternalTouchExplorationStateChangeListener();
		}
		mAccessibilityManager.addTouchExplorationStateChangeListener(mTouchExplorationStateChangeListener);
	}
	
	@Override
	public void removeStateChangeListeners() {
		super.removeStateChangeListeners();
		if (mCaptioningChangeListener != null) {
			mCaptioningManager.removeCaptioningChangeListener(mCaptioningChangeListener);
			mCaptioningChangeListener = null;
		}
		if (mTouchExplorationStateChangeListener != null) {
			mAccessibilityManager.removeTouchExplorationStateChangeListener(mTouchExplorationStateChangeListener);
			mTouchExplorationStateChangeListener = null;
		}
	}
	
	protected class InternalTouchExplorationStateChangeListener
		implements TouchExplorationStateChangeListener {
		
		@Override
		public void onTouchExplorationStateChanged(boolean enabled) {
			mMobileAccessibility.onTouchExplorationStateChanged(enabled);
		}
	}
}
