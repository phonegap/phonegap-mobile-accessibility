package com.phonegap.plugin.mobileaccessibility;


import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityManager;
import android.webkit.WebSettings;
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
	
	@SuppressWarnings("deprecation")
	@Override
	public int getTextZoom() {
	    int zoom = 100;
		WebSettings.TextSize wTextSize = mWebView.getSettings().getTextSize();
		switch (wTextSize) {
		case LARGEST:
			zoom = 200;
			break;
		case LARGER:
			zoom = 150;
			break;
		case NORMAL:
			zoom = 100;
			break;
		case SMALLER:
			zoom = 75;
			break;
		case SMALLEST:
			zoom = 50;
			break;
		default:
			zoom = 100;
			break;
		}
		return zoom;
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public void setTextZoom(int textZoom) {
		final int zoom = textZoom;
		WebSettings.TextSize wTextSize = WebSettings.TextSize.NORMAL;
		if (zoom > 115) {
			wTextSize = WebSettings.TextSize.LARGEST;
		} else if (zoom > 100) {
			wTextSize = WebSettings.TextSize.LARGER;
		} else if (zoom == 100) {
			wTextSize = WebSettings.TextSize.NORMAL;
		} else if (zoom > 50) {
			wTextSize = WebSettings.TextSize.SMALLER;
		} else {
			wTextSize = WebSettings.TextSize.SMALLEST;
		}
		//Log.i("MobileAccessibility", "fontScale = " + zoom + ", WebSettings.TextSize = " + wTextSize.toString());
		mWebView.getSettings().setTextSize(wTextSize);		
	}
}
