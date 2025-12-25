from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def hello(request):
    return JsonResponse({'message': 'Hello from core API, TESTTTTTTT'})


@csrf_exempt
def ai(request):
    """
    Accepts a string via:
    - POST: JSON body {"text": "your_string"} or raw body string
    """
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            text = body.get('text', '')
        except (json.JSONDecodeError, AttributeError):
            text = request.body.decode('utf-8')
            if not text:
                text = request.POST.get('text', '')

        return JsonResponse({'received': text})
    return JsonResponse({'yal': 'MONGOSE POST REQUEST'})