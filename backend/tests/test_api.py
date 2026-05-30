import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app import models
from app.utils.security import hash_password

# ── TEST DATABASE ─────────────────────────────────────────────
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


# ── FIXTURES ──────────────────────────────────────────────────
@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def test_user(db):
    user = models.User(
        name="Test User",
        email="test@proxypharma.cm",
        phone="+237600000001",
        hashed_password=hash_password("password123"),
        gdpr_consent=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_pharmacy(db):
    pharmacy = models.Pharmacy(
        name="Pharmacie Test",
        address="Rue Joss, Akwa",
        city="Douala",
        latitude=4.0511,
        longitude=9.7679,
        phone="+237233421560",
        onpc_number="ONPC-TEST-001",
        dpml_certified=True,
        is_active=True,
        is_open=True,
    )
    db.add(pharmacy)
    db.commit()
    db.refresh(pharmacy)
    return pharmacy


@pytest.fixture
def test_medicine(db):
    medicine = models.Medicine(
        name="Paracétamol 500mg",
        dci="Paracétamol",
        brand="Doliprane",
        cpnn_code="CPNN-TEST-001",
        category="Antalgique",
        requires_prescription=False,
        amm_valid=True,
    )
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine


@pytest.fixture
def test_stock(db, test_pharmacy, test_medicine):
    stock = models.Stock(
        pharmacy_id=test_pharmacy.id,
        medicine_id=test_medicine.id,
        quantity=50,
        price=850.0,
    )
    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock


@pytest.fixture
def auth_token(test_user):
    response = client.post("/api/v1/auth/login", json={
        "phone": "+237600000001",
        "password": "password123",
    })
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


# ══════════════════════════════════════════════════════════════
# AUTH TESTS
# ══════════════════════════════════════════════════════════════
class TestAuth:

    def test_register_success(self):
        response = client.post("/api/v1/auth/register", json={
            "name": "Marie Dupont",
            "email": "marie@proxypharma.cm",
            "phone": "+237600000002",
            "password": "password123",
            "gdpr_consent": True,
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["name"] == "Marie Dupont"

    def test_register_without_gdpr_fails(self):
        response = client.post("/api/v1/auth/register", json={
            "name": "Test",
            "email": "test2@proxypharma.cm",
            "phone": "+237600000003",
            "password": "password123",
            "gdpr_consent": False,
        })
        assert response.status_code == 400

    def test_register_duplicate_phone_fails(self, test_user):
        response = client.post("/api/v1/auth/register", json={
            "name": "Duplicate",
            "email": "dup@proxypharma.cm",
            "phone": "+237600000001",  # Same phone
            "password": "password123",
            "gdpr_consent": True,
        })
        assert response.status_code == 400

    def test_login_success(self, test_user):
        response = client.post("/api/v1/auth/login", json={
            "phone": "+237600000001",
            "password": "password123",
        })
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_login_wrong_password(self, test_user):
        response = client.post("/api/v1/auth/login", json={
            "phone": "+237600000001",
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    def test_get_me(self, test_user, auth_headers):
        response = client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@proxypharma.cm"

    def test_get_me_no_token(self):
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401

    def test_delete_account(self, test_user, auth_headers):
        response = client.delete("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        assert "supprimé" in response.json()["message"]


# ══════════════════════════════════════════════════════════════
# MEDICINES TESTS
# ══════════════════════════════════════════════════════════════
class TestMedicines:

    def test_search_medicines(self, test_medicine):
        response = client.get("/api/v1/medicines/search?q=Paracétamol")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1
        assert data["results"][0]["name"] == "Paracétamol 500mg"

    def test_search_no_results(self):
        response = client.get("/api/v1/medicines/search?q=MedicamentInexistant")
        assert response.status_code == 200
        assert response.json()["total"] == 0

    def test_get_medicine_by_id(self, test_medicine):
        response = client.get(f"/api/v1/medicines/{test_medicine.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["cpnn_code"] == "CPNN-TEST-001"
        assert data["amm_valid"] is True

    def test_get_medicine_not_found(self):
        response = client.get("/api/v1/medicines/nonexistent-id")
        assert response.status_code == 404

    def test_get_medicine_stocks(self, test_medicine, test_stock):
        response = client.get(
            f"/api/v1/medicines/{test_medicine.id}/stocks"
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["stocks"]) == 1
        assert data["stocks"][0]["price"] == 850.0

    def test_search_by_category(self, test_medicine):
        response = client.get(
            "/api/v1/medicines/search?category=Antalgique"
        )
        assert response.status_code == 200
        assert response.json()["total"] >= 1


# ══════════════════════════════════════════════════════════════
# PHARMACIES TESTS
# ══════════════════════════════════════════════════════════════
class TestPharmacies:

    def test_list_pharmacies(self, test_pharmacy):
        response = client.get("/api/v1/pharmacies/")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1

    def test_list_pharmacies_open_only(self, test_pharmacy):
        response = client.get("/api/v1/pharmacies/?open_only=true")
        assert response.status_code == 200
        results = response.json()["results"]
        assert all(p["is_open"] for p in results)

    def test_list_pharmacies_certified_only(self, test_pharmacy):
        response = client.get("/api/v1/pharmacies/?certified_only=true")
        assert response.status_code == 200
        results = response.json()["results"]
        assert all(p["dpml_certified"] for p in results)

    def test_get_pharmacy_by_id(self, test_pharmacy):
        response = client.get(f"/api/v1/pharmacies/{test_pharmacy.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["onpc_number"] == "ONPC-TEST-001"
        assert data["dpml_certified"] is True

    def test_get_pharmacy_not_found(self):
        response = client.get("/api/v1/pharmacies/nonexistent-id")
        assert response.status_code == 404

    def test_get_pharmacy_stock(self, test_pharmacy, test_stock):
        response = client.get(
            f"/api/v1/pharmacies/{test_pharmacy.id}/stock"
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["stock"]) == 1
        assert data["stock"][0]["quantity"] == 50

    def test_filter_by_city(self, test_pharmacy):
        response = client.get("/api/v1/pharmacies/?city=Douala")
        assert response.status_code == 200
        assert response.json()["total"] >= 1

        response2 = client.get("/api/v1/pharmacies/?city=Bafoussam")
        assert response2.json()["total"] == 0


# ══════════════════════════════════════════════════════════════
# ORDERS TESTS
# ══════════════════════════════════════════════════════════════
class TestOrders:

    def test_create_order_success(
        self, test_user, test_pharmacy, test_medicine,
        test_stock, auth_headers
    ):
        response = client.post("/api/v1/orders/", json={
            "pharmacy_id": test_pharmacy.id,
            "payment_method": "orange_money",
            "delivery_address": "Rue Joss, Akwa, Douala",
            "items": [
                {"medicine_id": test_medicine.id, "quantity": 2}
            ],
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.json()
        assert "order_number" in data
        assert data["order_number"].startswith("PP-")

    def test_create_order_insufficient_stock(
        self, test_user, test_pharmacy, test_medicine,
        test_stock, auth_headers
    ):
        response = client.post("/api/v1/orders/", json={
            "pharmacy_id": test_pharmacy.id,
            "payment_method": "cash",
            "delivery_address": "Douala",
            "items": [
                {"medicine_id": test_medicine.id, "quantity": 9999}
            ],
        }, headers=auth_headers)
        assert response.status_code == 400

    def test_create_order_no_auth(
        self, test_pharmacy, test_medicine, test_stock
    ):
        response = client.post("/api/v1/orders/", json={
            "pharmacy_id": test_pharmacy.id,
            "payment_method": "cash",
            "delivery_address": "Douala",
            "items": [{"medicine_id": test_medicine.id, "quantity": 1}],
        })
        assert response.status_code == 401

    def test_get_my_orders(
        self, test_user, test_pharmacy, test_medicine,
        test_stock, auth_headers
    ):
        # Create an order first
        client.post("/api/v1/orders/", json={
            "pharmacy_id": test_pharmacy.id,
            "payment_method": "cash",
            "delivery_address": "Douala",
            "items": [{"medicine_id": test_medicine.id, "quantity": 1}],
        }, headers=auth_headers)

        response = client.get("/api/v1/orders/my", headers=auth_headers)
        assert response.status_code == 200
        assert len(response.json()) >= 1

    def test_cancel_order(
        self, test_user, test_pharmacy, test_medicine,
        test_stock, auth_headers
    ):
        # Create order
        create_resp = client.post("/api/v1/orders/", json={
            "pharmacy_id": test_pharmacy.id,
            "payment_method": "cash",
            "delivery_address": "Douala",
            "items": [{"medicine_id": test_medicine.id, "quantity": 1}],
        }, headers=auth_headers)
        order_id = create_resp.json()["id"]

        # Cancel
        cancel_resp = client.post(
            f"/api/v1/orders/{order_id}/cancel",
            headers=auth_headers,
        )
        assert cancel_resp.status_code == 200
        assert "annulée" in cancel_resp.json()["message"]


# ══════════════════════════════════════════════════════════════
# HEALTH CHECK TEST
# ══════════════════════════════════════════════════════════════
class TestHealth:

    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
