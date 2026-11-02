"""Common contract for NetPilot router adapters.
Adapters must report unsupported features explicitly. No real hardware driver is included yet.
"""
from abc import ABC, abstractmethod
from typing import Any

class NotSupportedError(RuntimeError):
    pass

class RouterAdapter(ABC):
    adapter_id: str
    capabilities: dict[str, bool]

    @abstractmethod
    async def connect(self, config: dict[str, Any]) -> None: ...

    @abstractmethod
    async def health_check(self) -> dict[str, Any]: ...

    @abstractmethod
    async def list_clients(self) -> list[dict[str, Any]]: ...

    async def get_telemetry(self, client_id: str) -> dict[str, Any]:
        raise NotSupportedError("Telemetry is not supported")

    async def apply_bandwidth_policy(self, client_id: str, download_mbps: float, upload_mbps: float) -> None:
        raise NotSupportedError("Bandwidth enforcement is not supported")

    async def set_client_access(self, client_id: str, allowed: bool) -> None:
        raise NotSupportedError("Access control is not supported")

    async def disconnect(self) -> None:
        return None