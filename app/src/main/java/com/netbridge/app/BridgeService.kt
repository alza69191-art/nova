package com.netbridge.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder

class BridgeService : Service() {
    override fun onCreate() {
        super.onCreate()
        val channelId = "netbridge_running"
        val manager = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= 26) manager.createNotificationChannel(NotificationChannel(channelId, "NetBridge", NotificationManager.IMPORTANCE_LOW))
        val notification = if (Build.VERSION.SDK_INT >= 26) Notification.Builder(this, channelId).setContentTitle("NetBridge يعمل").setContentText("خدمة الاتصال المحلية نشطة").setSmallIcon(android.R.drawable.stat_sys_upload_done).setOngoing(true).build() else {
            @Suppress("DEPRECATION")
            Notification.Builder(this).setContentTitle("NetBridge يعمل").setContentText("خدمة الاتصال المحلية نشطة").setSmallIcon(android.R.drawable.stat_sys_upload_done).setOngoing(true).build()
        }
        startForeground(7, notification)
    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int) = START_STICKY
    override fun onBind(intent: Intent?): IBinder? = null
}
