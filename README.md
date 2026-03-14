# Laravel AI Chat Demo

A modern, responsive AI Chat application built with Laravel, React (Inertia.js), and the `laravel/ai` package. This project features full chat persistence, conversation history management, and a sleek dashboard for metrics.

## ✨ Features

- **Multi-Provider AI Support**: Seamlessly integrate with any major AI provider.
- **Persistent Chat History**: All conversations are stored in the database and linked to authenticated users.
- **Conversation Management**:
  - Switch between past conversations effortlessly via a dedicated sidebar.
  - Start fresh conversations with the "New Chat" feature.
- **Secure Authentication**: Built-in user authentication using Laravel Fortify.
- **Real-time Dashboard**: Track your total AI interactions with a statistics card on the home dashboard.
- **Modern UI/UX**:
  - Clean, professional design with Tailwind CSS and Shadcn UI.
  - Full Markdown support (tables, code blocks, formatting) for AI responses.
  - Automatic scrolling for a smooth chat experience.
  - Dark mode support.
- **Mobile Responsive**: Works perfectly on desktops, tablets, and phones.

## 🚀 Supported AI Providers

This project is built on the robust `laravel/ai` package, supporting a wide range of providers. Simply add your API key to `.env` and set your preferred default.

| Provider | Driver | .env Key |
|----------|--------|----------|
| **Google Gemini** | `gemini` | `GEMINI_API_KEY` |
| **OpenAI** | `openai` | `OPENAI_API_KEY` |
| **Anthropic** | `anthropic` | `ANTHROPIC_API_KEY` |
| **Mistral** | `mistral` | `MISTRAL_API_KEY` |
| **DeepSeek** | `deepseek` | `DEEPSEEK_API_KEY` |
| **Groq** | `groq` | `GROQ_API_KEY` |
| **Ollama** | `ollama` | `OLLAMA_API_KEY` |
| **Cohere** | `cohere` | `COHERE_API_KEY` |
| **X.AI (Grok)** | `xai` | `XAI_API_KEY` |
| **Jina AI** | `jina` | `JINA_API_KEY` |
| **Voyage AI** | `voyageai` | `VOYAGEAI_API_KEY` |
| **ElevenLabs** | `eleven` | `ELEVENLABS_API_KEY` |

## 🛠️ Installation

### 1. Prerequistes

- PHP 8.2+
- Node.js & NPM
- Composer

### 2. Setup Procedure

1. **Clone the repository**:
   ```bash
   git clone https://github.com/darshan-belani/laravel-ai-chat.git
   cd laravel-ai-chat
   ```

2. **Install dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Configure your environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Set up your API keys in `.env`**:
   Activate your preferred provider(s) by adding their keys:
   ```env
   AI_PROVIDER=gemini # Sets the default provider
   GEMINI_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   # ... add others as needed
   ```

5. **Run database migrations**:
   ```bash
   php artisan migrate
   ```

6. **Compile assets & Start**:
   ```bash
   npm run dev
   php artisan serve
   ```

## 📖 Usage

1. Register an account and log in.
2. Navigate to **AI Chat** from the sidebar.
3. Start chatting! Your messages will be saved automatically.
4. Go to the **Dashboard** to see your conversation statistics.

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).
