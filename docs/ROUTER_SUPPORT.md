# Router compatibility and adapter architecture

NetPilot uses pluggable router adapters. A listed vendor is not necessarily implemented or connected. Actual control requires validation against the exact hardware model, firmware and management API.

## Adapter targets
| Platform | Intended integration | Starter status |
|---|---|---|
| MikroTik RouterOS 7 | RouterOS API/REST; queues and address lists | Planned; not connected |
| OpenWrt | LAN agent; ubus/RPC, nftables and tc/SQM | Planned; not connected |
| TP-Link | Omada Controller API or model-specific API | Planned; consumer models vary |
| Huawei | Model/operator firmware-specific API | Planned; highly model-dependent |
| ZTE | Model/operator firmware-specific API | Planned; highly model-dependent |
| Ubiquiti UniFi | UniFi Network API | Planned; not connected |
| pfSense | Authenticated local API/package where available | Planned; not connected |
| OPNsense | Authenticated local API | Planned; not connected |
| Generic devices | SNMP/UPnP/standard interfaces | Monitoring only where available |

## Capability levels
- Level 0 — Manual: local user records and policies.
- Level 1 — Discovery: enumerate clients and read telemetry when exposed.
- Level 2 — Enforcement: per-client upload/download limits, schedules and access blocking.
- Level 3 — Advanced: quotas, fair queues, VLAN/SSID mapping, audit history and live telemetry.

Each adapter declares capabilities individually. Unsupported actions must remain disabled and return an explicit NotSupported response, never simulated success.

## Required adapter contract
- connect(config) and healthCheck()
- listClients() with stable client ID, IP, MAC and connection metadata
- getTelemetry(clientId) with timestamped byte counters and link state
- applyBandwidthPolicy(clientId, downloadMbps, uploadMbps)
- setClientAccess(clientId, allowed)
- removePolicy(clientId) and disconnect()

## Security
1. Run the connector on the user's LAN or a trusted local host. Never store router administrator credentials in browser JavaScript.
2. Use least-privilege accounts, encrypted secret storage, CSRF protection and HTTPS where supported.
3. Do not expose router management APIs to the public internet.
4. Require confirmation before blocking access or changing bandwidth policies.
5. Audit actor, target, old/new values and timestamp; support rollback.
6. Validate IP/MAC values and defend against SSRF, command injection and XSS.
7. Do not assume APIs are identical across models or firmware versions.

## Offline behavior
The PWA shell, local device list, local policies and backup work offline after installation. Live discovery, telemetry and enforcement need a local network path to the router; internet access is not required if the router and local connector are reachable.

## Validation before claiming support
Test exact model and firmware for authentication, discovery, IPv4/IPv6, DHCP changes, wireless clients, queue correctness, reboot persistence, recovery, rate units, concurrency and rollback. Publish compatibility only after passing these tests.