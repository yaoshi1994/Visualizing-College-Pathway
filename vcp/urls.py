from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('visColPath/', include('visColPath.urls')),
]