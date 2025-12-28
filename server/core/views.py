from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit
from decouple import config
import json
import requests

from .database import (
    get_or_create_user,
    create_conversation,
    get_conversation,
    add_message,
    get_messages_for_context,
    get_conversations_by_user
)

@csrf_exempt
@ratelimit(key='ip', rate=config('RATE_LIMIT', default='10/m'), method=['GET'], block=True)
def get_user_conversations(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)

    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"error": "user_id is required"}, status=400)

    conversations = get_conversations_by_user(user_id)

    # convert ObjectId to string
    for c in conversations:
        c["_id"] = str(c["_id"])

    return JsonResponse({"conversations": conversations}, status=200, safe=False)

@csrf_exempt
@ratelimit(key='ip', rate=config('RATE_LIMIT', default='10/m'), method=['GET', 'POST'], block=True)
def ai(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        body = json.loads(request.body)
        text = body.get('text', '')
        user_id = body.get('user_id', '')
        conversation_id = body.get('conversation_id', '')
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    if not text:
        return JsonResponse({'error': 'No text provided'}, status=400)

    if not user_id:
        return JsonResponse({'error': 'No user_id provided'}, status=400)

    try:
        # --- Ensure user exists ---
        get_or_create_user(user_id)

        # --- Get or create conversation ---
        if conversation_id:
            conversation = get_conversation(user_id, conversation_id)
            if not conversation:
                return JsonResponse({'error': 'Conversation not found'}, status=404)
        else:
            conversation_id = create_conversation(user_id)

        # --- Save user message ---
        add_message(conversation_id, "user", text)

        # --- Retrieve context messages ---
        context_messages = get_messages_for_context(conversation_id)

        # --- Build prompt ---
        prompt = ""
        for msg in context_messages:
            role = "User" if msg["role"] == "user" else "Assistant"
            prompt += f"{role}: {msg['content']}\n"

        # --- Send to Ollama ---
        response = requests.post(
            config('OLLAMA_API_URL', default='http://localhost:11434/api/generate'),
            json={
                "model": config('OLLAMA_MODEL', default='dz_bot'),
                "prompt": prompt,
                "stream": False
            },
            timeout=config('OLLAMA_TIMEOUT', default=120, cast=int)
        )

        response.raise_for_status()
        result = response.json()
        assistant_response = result.get("response", "")

        # --- Save assistant reply ---
        add_message(conversation_id, "assistant", assistant_response)

        return JsonResponse({
            "response": assistant_response,
            "model": result.get("model", ""),
            "done": result.get("done", False),
            "conversation_id": conversation_id,
            "message_count": len(context_messages) + 1
        })

    except requests.exceptions.ConnectionError:
        return JsonResponse({'error': 'Could not connect to Ollama. Make sure Ollama is running.'}, status=503)

    except requests.exceptions.Timeout:
        return JsonResponse({'error': 'Request to Ollama timed out'}, status=504)

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Ollama request failed: {str(e)}'}, status=500)

    except Exception as e:
        return JsonResponse({'error': f'Database error: {str(e)}'}, status=500)
