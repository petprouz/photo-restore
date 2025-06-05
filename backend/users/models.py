from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
