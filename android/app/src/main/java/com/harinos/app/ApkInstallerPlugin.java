package com.harinos.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

@CapacitorPlugin(name = "ApkInstaller")
public class ApkInstallerPlugin extends Plugin {

    @PluginMethod
    public void installApk(PluginCall call) {
        String filePath = call.getString("filePath");
        if (filePath == null || filePath.trim().isEmpty()) {
            call.reject("filePath is required");
            return;
        }

        try {
            // Check unknown sources permission on Android 8.0+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                boolean canInstall = getContext().getPackageManager().canRequestPackageInstalls();
                if (!canInstall) {
                    Intent manageIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    manageIntent.setData(Uri.parse("package:" + getContext().getPackageName()));
                    manageIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(manageIntent);
                }
            }

            Uri parsedUri = Uri.parse(filePath);
            String path = parsedUri.getPath();
            if (path == null) {
                path = filePath;
            }

            // Remove file:// prefix if present
            if (path.startsWith("file://")) {
                path = path.substring(7);
            }

            File file = new File(path);
            if (!file.exists()) {
                call.reject("Installation file not found: " + file.getAbsolutePath());
                return;
            }

            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri fileUri;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                String authority = getContext().getPackageName() + ".fileprovider";
                fileUri = FileProvider.getUriForFile(getContext(), authority, file);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                fileUri = Uri.fromFile(file);
            }

            intent.setDataAndType(fileUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to trigger installation: " + e.getMessage(), e);
        }
    }
}