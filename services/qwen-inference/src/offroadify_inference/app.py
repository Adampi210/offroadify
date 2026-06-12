"""FastAPI application for the Offroadify Qwen inference service."""

from fastapi import FastAPI

from offroadify_inference.config import Settings, load_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    app = FastAPI(title="Offroadify Qwen Inference Service", version="0.1.0")
    app.state.settings = settings if settings is not None else load_settings()
    app.state.model_loaded = False

    @app.get("/health")
    def health() -> dict[str, object]:
        return {"status": "ok", "model_loaded": app.state.model_loaded}

    return app


app = create_app()
