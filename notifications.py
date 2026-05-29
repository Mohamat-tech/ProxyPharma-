from loguru import logger
from app.config import settings


async def send_sms(phone: str, message: str):
    try:
        from twilio.rest import Client
        client = Client(
            settings.twilio_account_sid,
            settings.twilio_auth_token,
        )
        client.messages.create(
            body=message,
            from_=settings.twilio_phone,
            to=phone,
        )
        logger.info(f"SMS envoyé à {phone}")
    except Exception as e:
        logger.error(f"Erreur SMS: {e}")


async def send_otp_sms(phone: str, otp: str, order_number: str):
    message = (
        f"ProxyPharma — Votre code OTP pour confirmer "
        f"la réception de la commande {order_number} est : {otp}. "
        f"Valable 10 minutes."
    )
    await send_sms(phone, message)


async def send_order_confirmation_sms(
    phone: str,
    order_number: str,
    eta: int,
):
    message = (
        f"ProxyPharma — Commande {order_number} confirmée ! "
        f"Livraison estimée : {eta} minutes. "
        f"Suivez votre commande sur l'application."
    )
    await send_sms(phone, message)


async def send_push_notification(
    fcm_token: str,
    title: str,
    body: str,
):
    try:
        import httpx
        headers = {
            "Authorization": f"key={settings.fcm_server_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "to": fcm_token,
            "notification": {"title": title, "body": body},
        }
        async with httpx.AsyncClient() as client:
            await client.post(
                "https://fcm.googleapis.com/fcm/send",
                json=payload,
                headers=headers,
            )
        logger.info(f"Push notification envoyée")
    except Exception as e:
        logger.error(f"Erreur push: {e}")
