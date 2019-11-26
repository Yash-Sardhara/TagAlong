/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tagalong.tagalong;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.tagalong.tagalong.activity.HomeActivity;
import com.tagalong.tagalong.activity.MessageActivity;

import java.util.Map;
import java.util.Random;

import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

/**
 * NOTE: There can only be one service in each app that receives FCM messages. If multiple
 * are declared in the Manifest then the first one will be chosen.
 *
 * In order to make this Java sample functional, you must remove the following from the Kotlin messaging
 * service in the AndroidManifest.xml:
 *
 * <intent-filter>
 *   <action android:name="com.google.firebase.MESSAGING_EVENT" />
 * </intent-filter>
 */
public class FirebaseMessagingServiceHandler extends FirebaseMessagingService {

    private static final String TAG = "FirebaseMessagingServiceHandler";
    public static final String REQUEST_ACCEPT = "request_accept";

    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Credits to google for the base code.
        super.onMessageReceived(remoteMessage);
        Log.d(TAG, "Message from: " + remoteMessage.getFrom());

        Map <String,String> data = remoteMessage.getData();
        if (data != null && data.get("type").equals("Chat")) {
            handleChatNotification(remoteMessage, data);
        }
        else {
            handleNormalNotification(remoteMessage);
        }


    }

    private void handleNormalNotification(RemoteMessage remoteMessage) {
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
            String channelId = "Default";
            NotificationTimmingLogger notificationTimmingLogger = NotificationTimmingLogger.getInstance();
            notificationTimmingLogger.addSplit("handleChatNotification(): notification received");
            notificationTimmingLogger.dumpToLog();
            notificationTimmingLogger.reset();
            Intent intent = new Intent(this, HomeActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
            NotificationCompat.Builder builder = new  NotificationCompat.Builder(this, channelId)
                    .setSmallIcon(R.mipmap.ic_launcher_round)
                    .setContentTitle(remoteMessage.getNotification().getTitle())
                    .setContentText(remoteMessage.getNotification().getBody())
                    .setAutoCancel(true)
                    .setDefaults(Notification.DEFAULT_ALL)
                    .setContentIntent(pendingIntent);
            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(channelId, "Default channel", NotificationManager.IMPORTANCE_DEFAULT);
                manager.createNotificationChannel(channel);
            }
            Random random = new Random();
            manager.notify(random.nextInt(), builder.build());
            LocalBroadcastManager broadcastManager = LocalBroadcastManager.getInstance(getBaseContext());
            Intent intent2 = new Intent(REQUEST_ACCEPT);
            broadcastManager.sendBroadcast(intent2);
        }
    }

    private void handleChatNotification(RemoteMessage remoteMessage, Map<String, String> data){
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
            String channelId = "Default";
            NotificationTimmingLogger notificationTimmingLogger = NotificationTimmingLogger.getInstance();
            notificationTimmingLogger.addSplit("handleChatNotification(): chat notification received");
            Intent intent = new Intent(this, MessageActivity.class);
            intent.putExtra("ID",data.get("roomID") );
            System.out.println("ID" + data.get("roomID"));
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
            NotificationCompat.Builder builder = new  NotificationCompat.Builder(this, channelId)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(remoteMessage.getNotification().getTitle())
                    .setContentText(remoteMessage.getNotification().getBody())
                    .setAutoCancel(true)
                    .setDefaults(Notification.DEFAULT_ALL)
                    .setContentIntent(pendingIntent);
            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(channelId, "Default channel", NotificationManager.IMPORTANCE_DEFAULT);
                manager.createNotificationChannel(channel);
            }
            Random random = new Random();
            manager.notify(random.nextInt(), builder.build());
            LocalBroadcastManager broadcastManager = LocalBroadcastManager.getInstance(getBaseContext());
            Intent intent2 = new Intent(REQUEST_ACCEPT);
            broadcastManager.sendBroadcast(intent2);
        }
    }

}
