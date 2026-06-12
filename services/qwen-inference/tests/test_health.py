from fastapi.testclient import TestClient

from offroadify_inference.app import create_app


def test_health_returns_ok_without_model_loaded() -> None:
    client = TestClient(create_app())
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "model_loaded": False}
