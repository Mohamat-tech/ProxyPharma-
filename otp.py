import random
import string
from datetime import timedelta
import redis
from app.config import settings

r = redis.from_url(settings.redis_url)


def generate_otp(length: int = 4) -> str:
    return ''.join(random.choices(string.digits, k=length))


def store_otp(order_id: str, otp: str, ttl_minutes: int = 10):
    key = f"otp:{order_id}"
    r.setex(key, timedelta(minutes=ttl_minutes), otp)


def verify_otp(order_id: str, otp: str) -> bool:
    key = f"otp:{order_id}"
    stored = r.get(key)
    if stored and stored.decode() == otp:
        r.delete(key)
        return True
    return False
