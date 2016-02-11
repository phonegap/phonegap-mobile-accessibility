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

import android.accessibilityservice.AccessibilityServiceInfo;
import android.annotation.TargetApi;
import android.content.Context;
import android.view.accessibility.AccessibilityManager.TouchExplorationStateChangeListener;
import android.view.accessibility.CaptioningManager;
import android.view.accessibility.CaptioningManager.CaptioningChangeListener;

@TargetApi(19)
public class KitKatMobileAccessibilityHelper extends
        JellyBeanMobileAccessibilityHelper {
    private CaptioningManager mCaptioningManager;
    private CaptioningChangeListener mCaptioningChangeListener;
    private TouchExplorationStateChangeListener mTouchExplorationStateChangeListener;

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

    private class InternalTouchExplorationStateChangeListener
        implements TouchExplorationStateChangeListener {

        @Override
        public void onTouchExplorationStateChanged(boolean enabled) {
            mMobileAccessibility.onTouchExplorationStateChanged(enabled);
        }
    }
}
