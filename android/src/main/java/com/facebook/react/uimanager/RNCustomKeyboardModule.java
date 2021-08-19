
package com.facebook.react.uimanager;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.Nullable;
import android.text.InputType;
import android.util.Log;
import android.util.SparseArray;
import android.util.SparseBooleanArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.view.Gravity;
import android.widget.LinearLayout;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.views.textinput.ReactEditText;

import com.yusha.customKeyboard.CustomKeyBoardView;

import java.lang.reflect.Method;

public class RNCustomKeyboardModule extends ReactContextBaseJavaModule {
    private static final String TAG = RNCustomKeyboardModule.class.getName();
    private final int TAG_ID = 0xdeadbeaf;
    private final ReactApplicationContext reactContext;
    private ReactEditText curEditText;
    SparseBooleanArray sparseBooleanArray = new SparseBooleanArray();
    SparseArray<ReactRootView> sparseRootViewArray = new SparseArray<>();

    public RNCustomKeyboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    Handler handle = new Handler(Looper.getMainLooper());

    private ReactEditText getEditById(int id) {
        try {
            UIViewOperationQueue uii = this.getReactApplicationContext().getNativeModule(UIManagerModule.class).getUIImplementation().getUIViewOperationQueue();
            Log.i("react-native", String.valueOf(id));
            return (ReactEditText) uii.getNativeViewHierarchyManager().resolveView(id);
        } catch (Exception ex) {
            return null;
        }
    }

    @ReactMethod
    public void install(final int tag, final String type) {
        Log.i(TAG, "install");
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final Activity activity = getCurrentActivity();
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    Log.i("react-native", "no edit text");
                    return;
                }

                edit.setTag(TAG_ID, createCustomKeyboard(activity, tag, type));
                hideSystemSoftKeyboard(edit);

                edit.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                    @Override
                    public void onFocusChange(final View v, boolean hasFocus) {
                        Log.d(TAG, "OnFocusChangeListener.hasFocus" + hasFocus);
                        if (hasFocus) {
                            UiThreadUtil.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    ((InputMethodManager) getReactApplicationContext().getSystemService(Activity.INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(v.getWindowToken(), 0);
                                    curEditText = (ReactEditText) v;
                                    sparseBooleanArray.put(tag, true);
                                    WritableMap data = Arguments.createMap();
                                    data.putInt("tag", tag);
                                    Log.i("react-native", "------1data: " + data);
                                    sendEvent("showCustomKeyboard", data);

                                    handle.postDelayed(new Runnable() {
                                        public void run() {
                                            //execute the task
                                            if (sparseBooleanArray.get(tag)) {
                                                Log.d(TAG, "OnFocusChangeListener.hasFocus.showKeyboard");
                                                View keyboard = (View) curEditText.getTag(TAG_ID);
                                                final Activity activity = getCurrentActivity();
                                                ReactRootView reactRootView = sparseRootViewArray.get(tag);
                                                if (reactRootView != null && keyboard.getParent() == null && activity != null) {
                                                    Log.d(TAG, "OnFocusChangeListener.hasFocus.showKeyboard.activity.addContentView");
                                                    Bundle bundle = new Bundle();
                                                    bundle.putInt("tag", tag);
                                                    bundle.putString("type", type);
                                                    ReactInstanceManager mReactInstanceManager = ((ReactApplication) activity.getApplicationContext()).getReactNativeHost().getReactInstanceManager();
                                                    reactRootView.startReactApplication(mReactInstanceManager, "CustomKeyboard", bundle);
                                                    activity.addContentView(keyboard, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                                                }
                                            }
                                        }
                                    }, 100);
                                }
                            });
                        } else {
                            if (v == curEditText) {
                                handle.postDelayed(new Runnable() {
                                    public void run() {
                                        View keyboard = (View) edit.getTag(TAG_ID);
                                        ReactRootView reactRootView = sparseRootViewArray.get(tag);
                                        if (reactRootView != null && keyboard != null && keyboard.getParent() != null) {
                                            reactRootView.unmountReactApplication();
                                            Log.d(TAG, "OnFocusChangeListener.hasFocus.hideKeyboard");
                                            sparseBooleanArray.delete(tag);
                                            ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                                            WritableMap data = Arguments.createMap();
                                            data.putInt("tag", tag);
                                            Log.i("react-native", "------data: " + data);
                                            sendEvent("hideCustomKeyboard", data);
                                        }
                                    }
                                }, 100);
                            }
                        }
                    }
                });
            }
        });
    }

    private View createCustomKeyboard(Activity activity, int tag, String type) {
        Log.d(TAG, "createCustomKeyboard");
        LinearLayout layout = new LinearLayout(activity);
        ReactRootView rootView = new CustomKeyBoardView(this.getReactApplicationContext());
        final float scale = activity.getResources().getDisplayMetrics().density;
        LinearLayout.LayoutParams lParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, Math.round((252 + 54) * scale));
        lParams.gravity = Gravity.BOTTOM;
        layout.addView(rootView, lParams);
        sparseRootViewArray.put(tag, rootView);
        return layout;
    }

    @ReactMethod
    public void uninstall(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                edit.setTag(TAG_ID, null);
            }
        });
    }

    @ReactMethod
    public void insertText(final int tag, final String text) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                int start = Math.max(edit.getSelectionStart(), 0);
                int end = Math.max(edit.getSelectionEnd(), 0);
                edit.getText().replace(Math.min(start, end), Math.max(start, end),
                        text, 0, text.length());
            }
        });
    }

    @ReactMethod
    public void backSpace(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                int start = Math.max(edit.getSelectionStart(), 0);
                int end = Math.max(edit.getSelectionEnd(), 0);
                if (start != end) {
                    edit.getText().delete(start, end);
                } else if (start > 0) {
                    edit.getText().delete(start - 1, end);
                }
            }
        });
    }

    @ReactMethod
    public void doDelete(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                int start = Math.max(edit.getSelectionStart(), 0);
                int end = Math.max(edit.getSelectionEnd(), 0);
                if (start != end) {
                    edit.getText().delete(start, end);
                } else if (start > 0) {
                    edit.getText().delete(start, end + 1);
                }
            }
        });
    }

    @ReactMethod
    public void moveLeft(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                int start = Math.max(edit.getSelectionStart(), 0);
                int end = Math.max(edit.getSelectionEnd(), 0);
                if (start != end) {
                    edit.setSelection(start, start);
                } else {
                    edit.setSelection(start - 1, start - 1);
                }
            }
        });
    }

    @ReactMethod
    public void moveRight(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                int start = Math.max(edit.getSelectionStart(), 0);
                int end = Math.max(edit.getSelectionEnd(), 0);
                if (start != end) {
                    edit.setSelection(end, end);
                } else if (start > 0) {
                    edit.setSelection(end + 1, end + 1);
                }
            }
        });
    }

    @ReactMethod
    private void clearAll(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                int end = Math.max(edit.getSelectionEnd(), 0);
                if (end > 0) {
                    edit.getText().delete(0, end);
                }
            }
        });
    }

    @ReactMethod
    public void switchSystemKeyboard(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }

                View keyboard = (View) edit.getTag(TAG_ID);
                if (keyboard.getParent() != null) {
                    ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                }
                UiThreadUtil.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        ((InputMethodManager) getReactApplicationContext().getSystemService(Activity.INPUT_METHOD_SERVICE)).showSoftInput(edit, InputMethodManager.SHOW_IMPLICIT);
                    }
                });
            }
        });
    }

    protected void sendEvent(String eventName, @Nullable WritableMap params) {
        Log.i("react-native", "send Event name:" + eventName + " params tag: " + params);
        this.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Override
    public String getName() {
        return "CustomKeyboard";
    }

    /**
     * 隐藏系统键盘
     *
     * @param editText
     */
    public static void hideSystemSoftKeyboard(EditText editText) {
        int sdkInt = Build.VERSION.SDK_INT;
        if (sdkInt >= 11) {
            try {
                Class<EditText> cls = EditText.class;
                Method setShowSoftInputOnFocus;
                setShowSoftInputOnFocus = cls.getMethod("setShowSoftInputOnFocus", boolean.class);
                setShowSoftInputOnFocus.setAccessible(true);
                setShowSoftInputOnFocus.invoke(editText, false);
            } catch (SecurityException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            editText.setInputType(InputType.TYPE_NULL);
        }
    }

    @ReactMethod
    public void hideKeyboard(final int tag) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ReactEditText edit = getEditById(tag);
                if (edit == null) {
                    return;
                }
                View keyboard = (View) edit.getTag(TAG_ID);
                if (keyboard.getParent() != null) {
                    ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                }
            }
        });
    }

}
