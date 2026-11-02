# NetPilot — Offline Network Manager

Arabic-first, installable PWA starter for managing network users and recording per-device bandwidth policies.

## Included
- RTL responsive dashboard (Arabic)
- Local user/device records: IP, MAC, download/upload caps, data quota, enabled flag
- Search, edit, pause/resume state, delete
- Local JSON backup and restore
- Service worker shell cache and installable PWA manifest
- No runtime CDN or JavaScript package dependencies

## Run
Serve this directory from a local HTTP server (service workers require HTTPS or localhost). For example:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. After the first successful load, the interface shell is cached and can reopen offline. Data is stored in this browser's localStorage; it is not synchronized between devices.

## Important: router enforcement is not implemented yet
This version is an offline-capable management UI and local policy store. It does **not** discover clients, measure live throughput, block traffic, or enforce rate limits on a router. Those functions require a local router integration and a compatible gateway.

Planned adapters:
- **OpenWrt:** local agent/API using SQM/CAKE or nftables/traffic-control, with authenticated LAN-only access.
- **MikroTik RouterOS 7:** authenticated RouterOS API/REST adapter and per-client queue management.

Never expose router credentials in browser JavaScript or commit them to this repository. The router connector should run locally on the LAN with least-privilege credentials.

## Next required decision
Choose the router/gateway model and firmware before implementing real traffic enforcement. The adapter and installation package differ between MikroTik RouterOS and OpenWrt.