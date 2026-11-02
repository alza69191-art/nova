# NetBridge Android

Native Android starter project using Kotlin. Open this repository in Android Studio and select the netbridge-android branch.

## Implemented foundation
- Android application scaffold (minimum Android 6 / API 23).
- Wi-Fi Direct group create/remove actions, subject to device support and runtime permissions.
- Foreground notification service.
- Shortcut to Android tethering settings.
- Dark, Arabic-first starter interface.

## Important limitations
This is an initial Android foundation, not a completed internet repeater. Wi-Fi Direct creates a local peer group; it does not automatically route the phone's upstream Wi-Fi or cellular connection to peers. Android hotspot/tethering controls are restricted by OS version, OEM and carrier. No per-client traffic accounting, client blocking, QR onboarding, HTTP/SOCKS proxy, VPN routing, or automatic Wi-Fi upstream forwarding is implemented yet.

Do not advertise universal no-root Wi-Fi repeating. Validate each feature on physical devices and Android versions. Never collect or store Wi-Fi passwords or router credentials in the client app.

## Build
Open the repository root in Android Studio, sync Gradle, then build the app module. Android SDK 35 and a compatible JDK are required.
