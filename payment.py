from loguru import logger
from app.config import settings


class OrangeMoneyService:
    BASE_URL = "https://api.orange.com/orange-money-webpay/cm/v1"

    async def initiate_payment(
        self,
        amount: float,
        phone: str,
        order_ref: str,
        callback_url: str,
    ) -> dict:
        # TODO: Intégrer l'API Orange Money réelle
        logger.info(f"Orange Money payment: {amount} FCFA → {phone}")
        return {
            "status": "pending",
            "payment_url": f"https://api.orange.com/pay/{order_ref}",
            "ref": order_ref,
        }

    async def verify_payment(self, order_ref: str) -> dict:
        # TODO: Vérifier le statut du paiement
        logger.info(f"Verifying Orange Money payment: {order_ref}")
        return {"status": "success", "ref": order_ref}


class MTNMoMoService:
    BASE_URL = "https://sandbox.momodeveloper.mtn.com"

    async def initiate_payment(
        self,
        amount: float,
        phone: str,
        order_ref: str,
    ) -> dict:
        # TODO: Intégrer l'API MTN MoMo réelle
        logger.info(f"MTN MoMo payment: {amount} FCFA → {phone}")
        return {
            "status": "pending",
            "transaction_id": order_ref,
        }

    async def verify_payment(self, transaction_id: str) -> dict:
        # TODO: Vérifier le statut du paiement
        logger.info(f"Verifying MTN MoMo payment: {transaction_id}")
        return {"status": "success", "transaction_id": transaction_id}


orange_money = OrangeMoneyService()
mtn_momo = MTNMoMoService()
