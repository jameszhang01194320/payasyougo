from django.db import models

# Create your models here.
# accounts/models.py

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, BaseUserManager, AbstractBaseUser # User，

# ----------------------------------------------------------------------
# ： (CustomUser)
#  User  Django  User ：
#   1.  settings.py ：AUTH_USER_MODEL = 'accounts.CustomUser'
#   2. （BaseUserManager）。
#       CustomUser，， Django 。
#      ， Django  User ， AbstractUser，
#       models.Model ， User 。
#       AbstractUser 。
# ----------------------------------------------------------------------

# ：DjangoUser，AbstractUser
class CustomUser(AbstractUser): #  AbstractUser Django
    # Django  AbstractUser  id, email, password_hash (Djangopassword),
    # first_name, last_name, created_at, updated_at 。
    # password_hash Django 'password'，Django。

    # email  AbstractUser ， unique=True，forms
    # email = models.EmailField(unique=True, null=False, blank=False) #  email 

    company_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ： unique related_name
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name='customuser_set', # <-- ，
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_permissions_set', # <-- ，
        related_query_name='user',
    )

    class Meta:
        db_table = 'Users'
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email or self.username


class Client(models.Model):
    # __tablename__ = 'Clients'
    user = models.ForeignKey(
        CustomUser, #  Django  User ：settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='clients' # ，User.clients  Client
    )
    name = models.CharField(max_length=255) # nullable=False  Django  (required)
    email = models.EmailField(max_length=255, blank=True, null=True) # ，blank=True, null=True
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Clients' # 
        verbose_name = "Client"
        verbose_name_plural = "Clients"

    def __str__(self):
        return self.name


class Invoice(models.Model):
    # __tablename__ = 'Invoices'
    user = models.ForeignKey(
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    invoice_number = models.CharField(max_length=100, unique=True)
    issue_date = models.DateField()
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(
        max_length=10, #  'cancelled' 
        choices=STATUS_CHOICES,
        default='draft'
    )
    notes = models.TextField(blank=True, null=True)
    payment_gateway_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Invoices'
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"

    def __str__(self):
        return self.invoice_number


class InvoiceItem(models.Model):
    # __tablename__ = 'InvoiceItems'
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='items'
    )
    description = models.TextField() # nullable=False 
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'InvoiceItems'
        verbose_name = "Invoice Item"
        verbose_name_plural = "Invoice Items"

    def __str__(self):
        return f"{self.description} ({self.invoice.invoice_number})"


class TimeEntry(models.Model):
    # __tablename__ = 'TimeEntries'
    user = models.ForeignKey(
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='time_entries'
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL, #  Client ， SET_NULL  CASCADE
        related_name='time_entries',
        blank=True, # 
        null=True   # 
    )
    project_name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.IntegerField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_billed = models.BooleanField(default=False)
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.SET_NULL, #  Invoice ， SET_NULL
        related_name='time_entries_billed', # 
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'TimeEntries'
        verbose_name = "Time Entry"
        verbose_name_plural = "Time Entries"

    def __str__(self):
        return f"{self.project_name or 'No Project'} - {self.description[:50]}"


class Expense(models.Model):
    # __tablename__ = 'Expenses'
    user = models.ForeignKey(
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, blank=True, null=True)
    expense_date = models.DateField()
    receipt_image_url = models.CharField(max_length=255, blank=True, null=True) # ， ImageField  FileField
    is_reimbursable = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Expenses'
        verbose_name = "Expense"
        verbose_name_plural = "Expenses"

    def __str__(self):
        return f"{self.description} - {self.amount}"


class Payment(models.Model):
    # __tablename__ = 'Payments'
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    user = models.ForeignKey(
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField() # SQLAlchemyDateTime,DateTime
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    transaction_id = models.CharField(max_length=255, unique=True, blank=True, null=True) # unique=True 
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    status = models.CharField(
        max_length=10, #  'completed' 
        choices=STATUS_CHOICES,
        default='pending'
    )
    fee_charged = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Payments'
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self):
        return f"Payment for Invoice {self.invoice.invoice_number} - {self.amount}"


class TaxEstimation(models.Model):
    # __tablename__ = 'TaxEstimations'
    user = models.OneToOneField( # unique=True  nullable=False  OneToOneField
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True, # 
        related_name='tax_estimation' # User.tax_estimation  TaxEstimation
    )
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    estimated_amount_set_aside = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_calculated_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'TaxEstimations'
        verbose_name = "Tax Estimation"
        verbose_name_plural = "Tax Estimations"

    def __str__(self):
        return f"Tax Estimation for {self.user.email} - {self.tax_percentage}%"


class Setting(models.Model):
    # __tablename__ = 'Settings'
    user = models.OneToOneField( # unique=True  nullable=False  OneToOneField
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True, # 
        related_name='setting' # User.setting  Setting
    )
    currency = models.CharField(max_length=10, default='USD', blank=True, null=True) # blank/null
    timezone = models.CharField(max_length=50, default='UTC', blank=True, null=True)
    invoice_prefix = models.CharField(max_length=20, blank=True, null=True) # 
    payment_terms = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Settings'
        verbose_name = "Setting"
        verbose_name_plural = "Settings"

    def __str__(self):
        return f"Settings for {self.user.email}"


class AuditLog(models.Model):
    # __tablename__ = 'AuditLogs'
    user = models.ForeignKey( # user_id  NULL
        CustomUser, #  settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, # user_idNULL，SET_NULL
        related_name='audit_logs',
        blank=True,
        null=True #  SQLAlchemy  user_id ，
    )
    action = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=100, blank=True, null=True)
    entity_id = models.IntegerField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True) # default=datetime.utcnow
    ip_address = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        db_table = 'AuditLogs'
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        return f"{self.action} on {self.entity_type}:{self.entity_id} by {self.user}"