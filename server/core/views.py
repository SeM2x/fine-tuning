from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit
import json


def hello(request):
    return JsonResponse({'message': 'Hello from core API, TESTTTTTTT'})
import requests


def ratelimit_error(request, exception):
    """Custom handler for rate limit exceeded."""
    return JsonResponse(
        {'error': 'Rate limit exceeded. Please try again later.'},
        status=429
    )


@csrf_exempt
@ratelimit(key='ip', rate='10/m', method=['GET', 'POST'], block=True)
def ai(request):
    """
    Accepts a string via:
    - GET: ?text=your_string
    - POST: JSON body {"text": "your_string"} or raw body string
    
    Sends the text to Ollama and returns the AI response.
    Rate limited to 10 requests per minute per IP.
    """
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            text = body.get('text', '')
        except (json.JSONDecodeError, AttributeError):
            text = request.body.decode('utf-8')
            if not text:
                text = request.POST.get('text', '')
    else:
        text = request.GET.get('text', '')

    if not text:
        return JsonResponse({'error': 'No text provided'}, status=400)

    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json = {
                'model': 'llama3.2',
                'prompt': text,
                'stream': False
            },
            timeout = 120
        )
        response.raise_for_status()
        
        result = response.json()
        return JsonResponse({
            'response': result.get('response', ''),
            'model': result.get('model', ''),
            'done': result.get('done', False)
        })
        
    except requests.exceptions.ConnectionError:
        return JsonResponse(
            {'error': 'Could not connect to Ollama. Make sure Ollama is running.'},
            status = 503
        )
    except requests.exceptions.Timeout:
        return JsonResponse(
            {'error': 'Request to Ollama timed out'},
            status = 504
        )
    except requests.exceptions.RequestException as e:
        return JsonResponse(
            {'error': f'Ollama request failed: {str(e)}'},
            status = 500
        )
