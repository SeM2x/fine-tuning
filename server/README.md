# 404_finders - Algerian Darija Chat Backend

Django backend API that serves as a bridge between the React frontend and the Ollama-hosted fine-tuned Qwen2.5 model specialized in Algerian Darija.

## Tech Stack

- **Django 6.0** REST API
- **MongoDB** with Djongo ODM
- **Ollama** for model inference
- **Rate limiting** for API protection
- **python-decouple** for environment configuration

## Features

- 🔌 Ollama model integration
- 💾 Conversation and message persistence
- 👤 User management
- 🛡️ Rate limiting protection
- 📝 Context-aware chat history
- 🔄 RESTful API endpoints

## Getting Started

### Prerequisites

- Python 3.8+
- MongoDB (local or remote)
- Ollama with the fine-tuned model installed

### Installation

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the server directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
DB_NAME=darija_chat

# Ollama Configuration
OLLAMA_URL=http://localhost:11434
DEFAULT_MODEL=qwen_darja

# Rate Limiting
RATE_LIMIT=10/m

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Database Setup

```bash
# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### Running the Server

```bash
python manage.py runserver
```

Server runs at `http://localhost:8000`

## API Endpoints

### `/ollama/api` (POST)
Send messages to the AI model

**Request:**
```json
{
  "text": "User message",
  "user_id": "user123",
  "conversation_id": "conv456"
}
```

**Response:**
```json
{
  "response": "AI response",
  "conversation_id": "conv456"
}
```

## Project Structure

```
server/
├── config/           # Django settings and URLs
├── core/            # Main application
│   ├── database.py  # MongoDB operations
│   ├── views.py     # API endpoints
│   └── urls.py      # URL routing
├── manage.py        # Django management script
└── requirements.txt # Python dependencies
```

## Architecture

The backend receives chat requests from the frontend, maintains conversation context in MongoDB, and forwards prompts to the Ollama-hosted fine-tuned model. Responses are stored and returned to the client.

The fine-tuning process used LoRA on Qwen2.5-7B with 1,000 Algerian Darija messages translated to English for training.

See [research.md](../research.md) for detailed information on the model fine-tuning process.

## Database Schema

- **User**: User accounts
- **Conversation**: Chat sessions per user
- **Message**: Individual messages with user/AI distinction

Refer to the class diagram in [research.md](../research.md) for detailed relationships.
