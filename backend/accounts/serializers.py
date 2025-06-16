# PayAsYouGo/backend/accounts/serializers.py

from rest_framework import serializers
from .models import (
    CustomUser,
    Client,
    Invoice,
    InvoiceItem,
    TimeEntry,
    Expense,
    Payment,
    TaxEstimation,
    Setting,
    AuditLog
)

class UserLoginResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser #  CustomUser 
        # 
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'company_name', 'phone_number']


# 
class RegisterSerializer(serializers.ModelSerializer):
    # password  write_only，
    password = serializers.CharField(write_only=True, required=True)
    # ， password2
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser #  CustomUser 
        # ：username, email, password, password2, first_name, last_name, phone_number, company_name
        # ：AbstractUserusername，Django。
        #  username ，（emailusername）
        #  username, email, password, (first_name, last_name, phone_number, company_name)
        fields = ['id', 'username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone_number', 'company_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}, # 
            'email': {'required': True}, #  email 
        }

    # ：
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    # ： save() 
    def create(self, validated_data):
        #  password2，
        validated_data.pop('password2')
        #  create_user ，
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''), # .get()
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            company_name=validated_data.get('company_name', '')
        )
        return user

#  ()
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # fields = '__all__' #  __all__
        # ，
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'company_name', 'phone_number', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] # 

# 
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__' # 
        read_only_fields = ['created_at', 'updated_at']

# /
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

# ...  ModelSerializer
# : InvoiceItemSerializer, TimeEntrySerializer, ExpenseSerializer, PaymentSerializer, TaxEstimationSerializer, SettingSerializer, AuditLogSerializer

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem #  InvoiceItem
        fields = '__all__'  # （ id  invoice_id）
        # read_only_fields = ['id'] # ID，ID

class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment #  Payment
        fields = '__all__' # 
        read_only_fields = ['created_at', 'updated_at'] # 

class TaxEstimationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxEstimation
        fields = '__all__' #  TaxEstimation  Setting ，
        read_only_fields = ['created_at', 'updated_at', 'user']

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = '__all__' #  TaxEstimation  Setting ，
        read_only_fields = ['created_at', 'updated_at']

# ...  AuditLog 
class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['timestamp']