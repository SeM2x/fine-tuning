# 404_finders - Algerian Darija Chat Frontend

React-based chat interface for interacting with a LoRA fine-tuned Qwen2.5 model specialized in Algerian Darija dialect. The model understands and responds in Darija, making it accessible for Algerian users.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **React Router** for navigation

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time chat interface with AI model
- 🎨 Dark/light theme support
- 📱 Responsive mobile design
- 🤖 Model selection support
- 🔄 Conversation history management

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Configuration

Update `.env` with your backend URL:

```env
VITE_API_URL=your-backend-url/ollama/api
VITE_DEFAULT_MODEL=qwen_darja
```

### Development

```bash
pnpm dev
```

Runs the app at `http://localhost:5173`

### Build

```bash
pnpm build
```

## Project Structure

```
src/
├── api/          # API client and service functions
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Contexts, utilities, types
├── pages/        # Page components (Chat, Login, Register)
└── types/        # TypeScript definitions
```

## Architecture

The frontend communicates with a Django backend that interfaces with an Ollama-served model. The fine-tuning process used LoRA (Low-Rank Adaptation) on Qwen2.5-7B with Algerian Darija training data.

See [research.md](../research.md) for detailed information on the fine-tuning process.
