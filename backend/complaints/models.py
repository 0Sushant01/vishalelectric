from django.db import models
from django.conf import settings

class Complaint(models.Model):
    # Payment modes from checking constraint
    PAYMENT_MODE_CHOICES = [
        ('UPI', 'UPI'),
        ('CARD', 'CARD'),
        ('CASH', 'CASH'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ASSIGNED', 'Assigned'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CLOSED', 'Closed'),
    ]
    #  id SERIAL PRIMARY KEY,
    id=models.AutoField(primary_key=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints', null=True)
    address = models.TextField()
    issue_category = models.CharField(max_length=100, default='General')
    issue_description = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    
    charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, null=True, blank=True)
    payment_update=models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def balance(self):
        return float(self.charge or 0.0) - float(self.amount_paid or 0.0)

    def __str__(self):
        return f"Complaint #{self.id} - {self.status}"
