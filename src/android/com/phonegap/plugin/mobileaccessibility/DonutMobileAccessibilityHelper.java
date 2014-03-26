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

package com.phonegap.plugin.mobileaccessibility;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
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
    public double getTextZoom() {
        double zoom = 100;
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
    public void setTextZoom(double textZoom) {
        final double zoom = textZoom;
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
