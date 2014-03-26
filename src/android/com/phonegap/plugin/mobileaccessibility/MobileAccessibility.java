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

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Build;

/**
 * This class provides information on the status of native accessibility services to JavaScript.
 */
public class MobileAccessibility extends CordovaPlugin {
    protected AbstractMobileAccessibilityHelper mMobileAccessibilityHelper;
    protected CallbackContext mCallbackContext = null;
    protected boolean mIsScreenReaderRunning = false;
    protected boolean mClosedCaptioningEnabled = false;
    protected boolean mTouchExplorationEnabled = false;
    protected boolean mCachedIsScreenReaderRunning = false;
    protected float mFontScale = 1;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mMobileAccessibilityHelper = new KitKatMobileAccessibilityHelper();
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            mMobileAccessibilityHelper = new JellyBeanMobileAccessibilityHelper();
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
            mMobileAccessibilityHelper = new IceCreamSandwichMobileAccessibilityHelper();
        } else {
            mMobileAccessibilityHelper = new DonutMobileAccessibilityHelper();
        }
        mMobileAccessibilityHelper.initialize(this);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {
            if (action.equals("isScreenReaderRunning")) {
                isScreenReaderRunning(callbackContext);
                return true;
            } else if (action.equals("isClosedCaptioningEnabled")) {
                isClosedCaptioningEnabled(callbackContext);
                return true;
            } else if (action.equals("isTouchExplorationEnabled")) {
                isTouchExplorationEnabled(callbackContext);
                return true;
            } else if (action.equals("postNotification")) {
                if (args.length() > 1) {
                    String string = args.getString(1);
                    if (!string.isEmpty()) {
                        announceForAccessibility(string, callbackContext);
                    }
                }
                return true;
            } else if(action.equals("getTextZoom")) {
                getTextZoom(callbackContext);
                return true;
            } else if(action.equals("setTextZoom")) {
                if (args.length() > 0) {
                    double textZoom = args.getDouble(0);
                    if (textZoom > 0) {
                        setTextZoom(textZoom, callbackContext);
                    }
                }
                return true;
            } else if(action.equals("updateTextZoom")) {
                updateTextZoom(callbackContext);
                return true;
            } else if (action.equals("start")) {
                start(callbackContext);
                return true;
            } else if (action.equals("stop")) {
                stop();
                return true;
            }
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
        }
        return false;
    }

    /**
     * Called when the system is about to pause the current activity
     *
     * @param multitasking        Flag indicating if multitasking is turned on for app
     */
    @Override
    public void onPause(boolean multitasking) {
        //Log.i("MobileAccessibility", "onPause");
        mCachedIsScreenReaderRunning = mIsScreenReaderRunning;
    }

    /**
     * Called when the activity will start interacting with the user.
     *
     * @param multitasking        Flag indicating if multitasking is turned on for app
     */
    @Override
    public void onResume(boolean multitasking) {
        //Log.i("MobileAccessibility", "onResume");
        if (mIsScreenReaderRunning && !mCachedIsScreenReaderRunning) {
            //Log.i("MobileAccessibility", "Reloading page on reload because the Accessibility State has changed.");
            mCachedIsScreenReaderRunning = mIsScreenReaderRunning;
            stop();
            cordova.getActivity().runOnUiThread(new Runnable() {
                public void run() {
                        webView.reload();
                    }
                });
        }
    }

    /**
     * The final call you receive before your activity is destroyed.
     */
    public void onDestroy() {
        stop();
    }

    protected boolean isScreenReaderRunning(final CallbackContext callbackContext) {
        mIsScreenReaderRunning = mMobileAccessibilityHelper.isScreenReaderRunning();
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                    callbackContext.success(mIsScreenReaderRunning ? 1 : 0);
                }
            });
        return mIsScreenReaderRunning;
    }

    protected boolean isScreenReaderRunning() {
        mIsScreenReaderRunning = mMobileAccessibilityHelper.isScreenReaderRunning();
        return mIsScreenReaderRunning;
    }

    protected boolean isClosedCaptioningEnabled(final CallbackContext callbackContext) {
        mClosedCaptioningEnabled = mMobileAccessibilityHelper.isClosedCaptioningEnabled();
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                callbackContext.success(mClosedCaptioningEnabled ? 1 : 0);
            }
        });
        return mClosedCaptioningEnabled;
    }

    protected boolean isClosedCaptioningEnabled() {
        mClosedCaptioningEnabled = mMobileAccessibilityHelper.isClosedCaptioningEnabled();
        return mClosedCaptioningEnabled;
    }

    protected boolean isTouchExplorationEnabled(final CallbackContext callbackContext) {
        mTouchExplorationEnabled= mMobileAccessibilityHelper.isTouchExplorationEnabled();
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                callbackContext.success(mTouchExplorationEnabled ? 1 : 0);
            }
        });
        return mTouchExplorationEnabled;
    }

    protected boolean isTouchExplorationEnabled() {
        mTouchExplorationEnabled = mMobileAccessibilityHelper.isTouchExplorationEnabled();
        return mTouchExplorationEnabled;
    }

    protected void announceForAccessibility(CharSequence text, final CallbackContext callbackContext) {
        mMobileAccessibilityHelper.announceForAccessibility(text);
        if (callbackContext != null) {
            JSONObject info = new JSONObject();
            try {
                info.put("stringValue", text);
                info.put("wasSuccessful", mIsScreenReaderRunning);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            callbackContext.success(info);
        }
    }

    public void onAccessibilityStateChanged(boolean enabled) {
        mIsScreenReaderRunning = enabled;
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                    sendMobileAccessibilityStatusChangedCallback();
                }
            });
    }

    public void onCaptioningEnabledChanged(boolean enabled) {
        mClosedCaptioningEnabled = enabled;
        cordova.getActivity().runOnUiThread(new Runnable() {
             public void run() {
                    sendMobileAccessibilityStatusChangedCallback();
                }
            });
    }

    public void onTouchExplorationStateChanged(boolean enabled) {
        mTouchExplorationEnabled = enabled;
        cordova.getActivity().runOnUiThread(new Runnable() {
             public void run() {
                    sendMobileAccessibilityStatusChangedCallback();
                }
            });
    }

    public void getTextZoom(final CallbackContext callbackContext) {
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                final double textZoom = mMobileAccessibilityHelper.getTextZoom();
                if (callbackContext != null) {
                    callbackContext.success((int) textZoom);
                }
            }
        });
    }

    public void setTextZoom(final double textZoom, final CallbackContext callbackContext) {
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                mMobileAccessibilityHelper.setTextZoom(textZoom);
                if (callbackContext != null) {
                    callbackContext.success((int) mMobileAccessibilityHelper.getTextZoom());
                };
            }
        });
    }

    public void setTextZoom(final double textZoom) {
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                mMobileAccessibilityHelper.setTextZoom(textZoom);
            }
        });
    }

    public void updateTextZoom(final CallbackContext callbackContext) {
        float fontScale = cordova.getActivity().getResources().getConfiguration().fontScale;
        if (fontScale != mFontScale) {
            mFontScale = fontScale;
        }
        final double textZoom = Math.round(mFontScale * 100);
        setTextZoom(textZoom, callbackContext);
    }

    protected void sendMobileAccessibilityStatusChangedCallback() {
        if (this.mCallbackContext != null) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, getMobileAccessibilityStatus());
            result.setKeepCallback(true);
            this.mCallbackContext.sendPluginResult(result);
        }
    }

    /* Get the current mobile accessibility status. */
    protected JSONObject getMobileAccessibilityStatus() {
        JSONObject status = new JSONObject();
        try {
            status.put("isScreenReaderRunning", mIsScreenReaderRunning);
            status.put("isClosedCaptioningEnabled", mClosedCaptioningEnabled);
            status.put("isTouchExplorationEnabled", mTouchExplorationEnabled);
            //Log.i("MobileAccessibility",  "MobileAccessibility.isScreenReaderRunning == " + status.getString("isScreenReaderRunning") +
            //        "\nMobileAccessibility.isClosedCaptioningEnabled == " + status.getString("isClosedCaptioningEnabled") +
            //        "\nMobileAccessibility.isTouchExplorationEnabled == " + status.getString("isTouchExplorationEnabled") );
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return status;
    }

    protected void start(CallbackContext callbackContext) {
        //Log.i("MobileAccessibility", "MobileAccessibility.start");
        mCallbackContext = callbackContext;
        mMobileAccessibilityHelper.addStateChangeListeners();
        sendMobileAccessibilityStatusChangedCallback();
    }

    protected void stop() {
        //Log.i("MobileAccessibility", "MobileAccessibility.stop");
        if (mCallbackContext != null) {
            sendMobileAccessibilityStatusChangedCallback();
            mMobileAccessibilityHelper.removeStateChangeListeners();
            mCallbackContext = null;
        }
    }
}
