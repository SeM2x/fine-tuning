from django.urls import path
from .views import hello, ai

urlpatterns = [
    path('', hello, name='root'),
    path('hello/', hello, name='hello'),
    path('ai/', ai, name='ai'),
]
