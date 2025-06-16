# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin #  UserAdmin
from .models import (
    CustomUser, #  CustomUser
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

# 1.  CustomUser  Admin 
#  UserAdmin 
class CustomUserAdmin(UserAdmin):
    #  CustomUser ， fieldsets  add_fieldsets 
    # ：
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('company_name', 'phone_number', 'created_at', 'updated_at')}),
    )
    # 
    list_display = UserAdmin.list_display + ('company_name', 'phone_number')
    # search_fields = UserAdmin.search_fields + ('company_name', 'phone_number')
    # filter_horizontal = ('groups', 'user_permissions',) # AbstractUser，CustomUserAdmin

# 2.  CustomUser
admin.site.register(CustomUser, CustomUserAdmin) #  CustomUserAdmin

# 3. （）
admin.site.register(Client)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)
admin.site.register(TimeEntry)
admin.site.register(Expense)
admin.site.register(Payment)
admin.site.register(TaxEstimation)
admin.site.register(Setting)
admin.site.register(AuditLog)