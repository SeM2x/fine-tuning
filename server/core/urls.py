from django.urls import path
from .views import ai, get_user_conversations

urlpatterns = [
    path('ai/', ai, name='ai'),
    path("conversations/", get_user_conversations, name="get_user_conversations"),
]
