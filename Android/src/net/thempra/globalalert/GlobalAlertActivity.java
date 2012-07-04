package net.thempra.globalalert;

import com.phonegap.*;
import android.os.Bundle;
import android.os.Vibrator;

public class GlobalAlertActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        ((Vibrator)getSystemService(VIBRATOR_SERVICE)).vibrate(1000);

    }
}
