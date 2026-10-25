from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'

def test_invalid_image():
    response = client.post('/api/analyze', files={'image': ('x.txt', b'not an image', 'text/plain')}, data={'mode':'food'})
    assert response.status_code == 415

def test_meal_validation():
    response = client.post('/api/meal-plan', json={'diet':'invalid'})
    assert response.status_code == 422
