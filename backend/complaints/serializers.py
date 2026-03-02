from rest_framework import serializers
from .models import Complaint
from accounts.models import User

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'phone_number']

class ComplaintListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    phone = serializers.CharField(source='customer.phone_number', read_only=True)
    
    class Meta:
        model = Complaint
        fields = ['id', 'customer', 'customer_name', 'phone', 'address', 'issue_category', 'issue_description', 'status', 'charge', 'amount_paid', 'created_at']

class ComplaintDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'id', 'customer', 'address', 'issue_category', 'issue_description', 
            'status', 'charge', 'amount_paid', 'payment_mode', 'payment_update', 
            'created_at', 'updated_at', 'balance'
        ]
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at', 'payment_update']

    def validate(self, data):
        # amount_paid cannot exceed charge
        charge = data.get('charge', self.instance.charge if self.instance else 0)
        amount_paid = data.get('amount_paid', self.instance.amount_paid if self.instance else 0)

        # Convert to Decimal/float safely to compare
        if amount_paid is not None and charge is not None:
            if float(amount_paid) > float(charge):
                raise serializers.ValidationError({"amount_paid": "Amount paid cannot exceed the total charge."})
        
        # Checking permissions for updates
        request = self.context.get('request')
        if request and request.user and self.instance:
            if request.user.role not in ['ADMIN', 'OWNER']:
                # Customers cannot update financial fields and status (strict check just in case IsOwnerOrAdmin isn't used)
                restricted_fields = ['charge', 'amount_paid', 'payment_mode', 'status']
                for field in restricted_fields:
                    if field in data:
                        raise serializers.ValidationError({field: f"Role {request.user.role} is not allowed to update this field."})

        return data
