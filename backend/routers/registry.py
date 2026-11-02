"""Explicit router adapter catalog. Drivers are registered after model testing."""
from dataclasses import dataclass

@dataclass(frozen=True)
class AdapterInfo:
    id: str
    name: str
    status: str
    capabilities: tuple[str, ...]

CATALOG = [
    AdapterInfo("mikrotik-routeros", "MikroTik RouterOS 7", "planned", ("client_discovery", "telemetry", "bandwidth_enforcement", "access_control")),
    AdapterInfo("openwrt", "OpenWrt", "planned", ("client_discovery", "telemetry", "bandwidth_enforcement", "access_control")),
    AdapterInfo("tp-link-omada", "TP-Link Omada", "planned", ("client_discovery", "telemetry", "bandwidth_enforcement")),
    AdapterInfo("huawei", "Huawei (model-specific)", "model-dependent", ("client_discovery", "telemetry")),
    AdapterInfo("zte", "ZTE (model-specific)", "model-dependent", ("client_discovery", "telemetry")),
    AdapterInfo("unifi", "Ubiquiti UniFi", "planned", ("client_discovery", "telemetry", "bandwidth_enforcement", "access_control")),
    AdapterInfo("pfsense", "pfSense", "planned", ("client_discovery", "telemetry", "bandwidth_enforcement", "access_control")),
    AdapterInfo("opnsense", "OPNsense", "planned", ("client_discovery", "telemetry", "bandwidth_enforcement", "access_control")),
    AdapterInfo("generic-snmp", "Generic SNMP / UPnP", "monitoring-only", ("discovery", "telemetry")),
]

def list_adapters():
    return [dict(id=x.id, name=x.name, status=x.status, capabilities=list(x.capabilities)) for x in CATALOG]