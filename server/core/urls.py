from django.urls import path
from .views import hello

urlpatterns = [
    path('', hello, name='root'),
    path('hello/', hello, name='hello'),
]
