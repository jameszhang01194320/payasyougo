from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AuditLogListView,
    CustomUserViewSet,
    ClientListCreateView,
    ClientRetrieveUpdateDestroyView,
    ExpenseListCreateView,
    ExpenseRetrieveUpdateDestroyView,
    InvoiceListCreateView,
    RegisterView,
    InvoiceRetrieveUpdateDestroyView,
    SettingListCreateView,
    SettingRetrieveUpdateDestroyView,
    TaxEstimationView,
    TimeEntryListCreateView,
    TimeEntryRetrieveUpdateDestroyView
)

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('clients/', ClientListCreateView.as_view(), name='client-list-create'),
    path('clients/<int:pk>/', ClientRetrieveUpdateDestroyView.as_view(), name='client-detail-update-destroy'),
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice-list-create'),
    path('invoices/<int:pk>/', InvoiceRetrieveUpdateDestroyView.as_view(), name='invoice-detail-update-destroy'),
    path('time-entries/', TimeEntryListCreateView.as_view(), name='timeentry-list-create'),
    path('time-entries/<int:pk>/', TimeEntryRetrieveUpdateDestroyView.as_view(), name='timeentry-detail-update-destroy'),
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseRetrieveUpdateDestroyView.as_view(), name='expense-detail-update-destroy'),
    path('tax-estimation/', TaxEstimationView.as_view(), name='taxestimation-detail'),
    path('settings/', SettingListCreateView.as_view(), name='setting-list-create'),
    path('settings/<int:pk>/', SettingRetrieveUpdateDestroyView.as_view(), name='setting-detail-update-destroy'),
    path('audit-logs/', AuditLogListView.as_view(), name='auditlog-list'),
    path('', include(router.urls)),
]
