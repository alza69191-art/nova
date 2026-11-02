package com.netbridge.app

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.wifi.p2p.WifiP2pManager
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var status: TextView
    private var manager: WifiP2pManager? = null
    private var channel: WifiP2pManager.Channel? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = 0xFF101827.toInt()
        window.navigationBarColor = 0xFF101827.toInt()
        manager = getSystemService(WIFI_P2P_SERVICE) as? WifiP2pManager
        channel = manager?.initialize(this, mainLooper, null)
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(28, 36, 28, 28); setBackgroundColor(0xFF101827.toInt()) }
        fun label(value: String, size: Float, color: Int = 0xFFFFFFFF.toInt()) = TextView(this).apply { text = value; textSize = size; setTextColor(color); setPadding(0, 10, 0, 14) }
        root.addView(label("NetBridge", 30f))
        root.addView(label("مشاركة الاتصال وإدارة الأجهزة", 17f, 0xFFB8C4D8.toInt()))
        status = label("الحالة: متوقف", 18f, 0xFF8BE0B0.toInt()); root.addView(status)
        root.addView(label("ملاحظة: Wi‑Fi Direct ينشئ اتصالاً محلياً فقط. تمرير إنترنت Wi‑Fi إلى الأجهزة الأخرى يحتاج دعماً من الجهاز أو صلاحيات توجيه إضافية.", 14f, 0xFFFFD28A.toInt()))
        root.addView(button("بدء خدمة NetBridge") { startBridgeService(); createP2pGroup() })
        root.addView(button("إيقاف مجموعة Wi‑Fi Direct") { removeP2pGroup() })
        root.addView(button("إعدادات نقطة الاتصال") { runCatching { startActivity(Intent("android.settings.TETHER_SETTINGS")) }.onFailure { startActivity(Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS)) } })
        root.addView(label("المرحلة الحالية: تأسيس تطبيق Android أصلي. لا يوجد حتى الآن توجيه إنترنت أو حظر أجهزة أو قياس استهلاك لكل جهاز.", 13f, 0xFFB8C4D8.toInt()))
        setContentView(root); requestRuntimePermissions()
    }
    private fun button(value: String, action: () -> Unit) = Button(this).apply { text = value; isAllCaps = false; setOnClickListener { action() } }
    private fun requestRuntimePermissions() {
        val permissions = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= 33) permissions += Manifest.permission.NEARBY_WIFI_DEVICES else permissions += Manifest.permission.ACCESS_FINE_LOCATION
        if (Build.VERSION.SDK_INT >= 33) permissions += Manifest.permission.POST_NOTIFICATIONS
        val missing = permissions.filter { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
        if (missing.isNotEmpty()) requestPermissions(missing.toTypedArray(), 20)
    }
    private fun startBridgeService() { val intent = Intent(this, BridgeService::class.java); if (Build.VERSION.SDK_INT >= 26) startForegroundService(intent) else startService(intent) }
    private fun createP2pGroup() {
        val m = manager ?: return show("Wi‑Fi Direct غير مدعوم على هذا الجهاز")
        val c = channel ?: return show("تعذر تهيئة Wi‑Fi Direct")
        try { m.createGroup(c, object : WifiP2pManager.ActionListener {
            override fun onSuccess() { status.text = "الحالة: تم إنشاء مجموعة Wi‑Fi Direct محلية" }
            override fun onFailure(reason: Int) { show("فشل إنشاء المجموعة: $reason") }
        }) } catch (_: SecurityException) { show("امنح إذن الأجهزة القريبة ثم أعد المحاولة") }
    }
    private fun removeP2pGroup() {
        val m = manager ?: return; val c = channel ?: return
        try { m.removeGroup(c, object : WifiP2pManager.ActionListener {
            override fun onSuccess() { status.text = "الحالة: تم إيقاف المجموعة" }
            override fun onFailure(reason: Int) { show("تعذر الإيقاف: $reason") }
        }) } catch (_: SecurityException) { show("لا توجد صلاحية كافية") }
    }
    private fun show(message: String) = Toast.makeText(this, message, Toast.LENGTH_LONG).show()
}
