from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Portfolio(models.Model):
    username = models.CharField(max_length=64)
    asset_name = models.CharField(max_length=64)
    asset_id = models.CharField(max_length=64)
    asset_symbol = models.CharField(max_length=64)
    quantity = models.DecimalField(max_digits=19, decimal_places=10)
    price = models.DecimalField(max_digits=19, decimal_places=10)
    total_spent = models.IntegerField()
    date = models.DateTimeField(auto_now = True)
    type = models.CharField(max_length=12)
    def serialize(self):
        return {
            "username": self.username,
            "asset_name": self.asset_name,
            "asset_id": self.asset_id,
            "asset_symbol": self.asset_symbol,
            "quantity": self.quantity,
            "price": self.price,
            "total_spent": self.total_spent,
            "date": self.date,
            "type": self.type,
        }

class Comments(models.Model):
    username = models.CharField(max_length=64)
    asset_id = models.CharField(max_length=64)
    comment = models.CharField(max_length=280)
    date = models.DateTimeField(auto_now = True)
    type = models.CharField(max_length=32)
    def serialize(self):
        return {
            "username": self.username,
            "asset_id": self.asset_id,
            "comment": self.comment,
            "date": self.date,
            "type": self.type,
        }
