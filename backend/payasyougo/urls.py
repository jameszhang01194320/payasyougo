"""
URL configuration for payasyougo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
# from rest_framework.authtoken import views # <-- Import the default auth token views
# Make sure to import your custom login view
from accounts.views import CustomLoginView # <-- Import your new CustomLoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')), # <--- Add this line
    # All your custom APIs will now be prefixed with /api/
    # path('api/login/', views.obtain_auth_token), # <-- Changed the URL path from api-token-auth/ to api/login/
    path('api/login/', CustomLoginView.as_view(), name='custom_login'), # <-- Replaced with your custom login view
]

