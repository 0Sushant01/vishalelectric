from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import random

class UserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('The Phone Number field must be set')
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        return self.create_user(phone_number, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('OWNER', 'Owner'),
        ('TECHNICIAN', 'Technician'),
        ('CUSTOMER', 'Customer'),
    )

    phone_number = models.CharField(max_length=15, unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    unique_id = models.CharField(max_length=6, unique=True, blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['full_name']

    def save(self, *args, **kwargs):
        if not self.unique_id:
            while True:
                new_id = str(random.randint(100000, 999999))
                if not User.objects.filter(unique_id=new_id).exists():
                    self.unique_id = new_id
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.role} - ID: {self.unique_id})"

class OTP(models.Model):
    phone_number = models.CharField(max_length=15)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def generate_code(self):
        self.code = str(random.randint(100000, 999999))
        self.save()
        print(f"DEBUG: OTP for {self.phone_number} is {self.code}")
        return self.code
