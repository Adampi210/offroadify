"""Environment-based configuration for the inference service."""

import os
from collections.abc import Mapping
from dataclasses import dataclass

DEFAULT_MODEL_ID = "Qwen/Qwen-Image-Edit-2511"
DEFAULT_DEVICE_PROFILE = "cuda"


@dataclass(frozen=True)
class Settings:
    model_id: str
    device_profile: str
    inference_token: str


def load_settings(env: Mapping[str, str] | None = None) -> Settings:
    source = os.environ if env is None else env
    return Settings(
        model_id=source.get("QWEN_MODEL_ID", DEFAULT_MODEL_ID),
        device_profile=source.get("QWEN_DEVICE_PROFILE", DEFAULT_DEVICE_PROFILE),
        inference_token=source.get("QWEN_INFERENCE_TOKEN", ""),
    )
