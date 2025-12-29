# 404_finders - Algerian Darija Chat Application

A full-stack chat application featuring a QLoRA fine-tuned Qwen2.5-3B model specialized in understanding and responding to Algerian Darija dialect.

## Overview

This project demonstrates fine-tuning a large language model (LLM) for a specific linguistic task - supporting Algerian Darija, a dialect that's underrepresented in mainstream AI models. The application provides a user-friendly interface for natural conversations in Darija.

## Architecture

```mermaid
flowchart TB
    A[React Frontend<br/>TypeScript]
    B[Django Backend<br/>Python]
    C[Ollama Model<br/>Qwen2.5 Fine-tuned]
    D[(MongoDB<br/>Conversations)]
    
    A <-->|API Requests| B
    B <-->|Model Inference| C
    B -->|Store/Retrieve| D
```

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- shadcn/ui + Tailwind CSS
- React Router

### Backend
- Django 6.0
- MongoDB (Djongo ODM)
- Ollama for model inference
- Rate limiting & authentication

### AI Model
- **Base Model**: Qwen2.5-3B-Instruct-bnb-4bit (7 billion parameters)
- **Fine-tuning Method**: LoRA (Low-Rank Adaptation)
- **Training Data**: 1,000 Algerian Darija messages

## Features

- 💬 Natural conversations in Algerian Darija
- 🔐 User authentication and authorization
- 📝 Persistent conversation history
- 🌓 Dark/light theme support
- 📱 Responsive design
- 🤖 Model selection capability
- 🛡️ Rate limiting for API protection

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- MongoDB
- Ollama with the fine-tuned model

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fine-tuning
   ```

2. **Setup Backend**
   ```bash
   cd server
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Setup Frontend**
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

4. **Configure Environment**
   - See [`client/README.md`](client/README.md) for frontend configuration
   - See [`server/README.md`](server/README.md) for backend configuration

## Project Structure

```
.
├── client/              # React frontend application
├── server/              # Django backend API
├── research.md          # Detailed fine-tuning methodology
├── *.json              # Training and data files
└── README.md           # This file
```

## Fine-Tuning Process

The model was fine-tuned using QLoRA on a dataset of 1,000 Algerian Darija messages. The training data was collected from Hugging Face, cleaned, and translated to English to create training pairs.

**Why QLoRA?**
- Efficient: Only trains adapter weights, not the entire model
- Resource-friendly: Requires significantly less GPU memory
- Maintains quality: Preserves base model capabilities while adding new skills

For detailed information about the fine-tuning methodology, data preparation, and technical decisions, see [`research.md`](research.md).

## Documentation

- [Frontend Documentation](client/README.md)
- [Backend Documentation](server/README.md)
- [Research & Methodology](research.md)

## Team

**404_finders** - BuildIT
