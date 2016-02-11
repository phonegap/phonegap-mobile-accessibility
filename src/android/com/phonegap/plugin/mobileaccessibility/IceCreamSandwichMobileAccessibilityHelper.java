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
import android.os.Build;
import android.view.accessibility.AccessibilityManager.AccessibilityStateChangeListener;

import java.lang.IllegalAccessException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
public class IceCreamSandwichMobileAccessibilityHelper extends
        DonutMobileAccessibilityHelper {
    private AccessibilityStateChangeListener mAccessibilityStateChangeListener;

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
    public double getTextZoom() {
        double zoom = 100;
        try {
            Method getSettings = mView.getClass().getMethod("getSettings");
            Object wSettings = getSettings.invoke(mView);
            Method getTextZoom = wSettings.getClass().getMethod("getTextZoom");
            zoom = Double.valueOf(getTextZoom.invoke(wSettings).toString());
        } catch (ClassCastException ce) {
            ce.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return zoom;
    }

    @Override
    public void setTextZoom(double textZoom) {
        //Log.i("MobileAccessibility", "setTextZoom(" + zoom + ")");
        try {
            Method getSettings = mView.getClass().getMethod("getSettings");
            Object wSettings = getSettings.invoke(mView);
            Method setTextZoom = wSettings.getClass().getMethod("setTextZoom", Integer.TYPE);
            setTextZoom.invoke(wSettings, (int) textZoom);
        } catch (ClassCastException ce) {
            ce.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    private class InternalAccessibilityStateChangeListener
        implements AccessibilityStateChangeListener {

        @Override
        public void onAccessibilityStateChanged(boolean enabled) {
            mMobileAccessibility.onAccessibilityStateChanged(enabled);
        }
    }
}
