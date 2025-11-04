# SmartFinance AI - Intelligent Financial Support Application

An Agnegtic AI and sophisticated customer service application powered by a multi-agent AI system designed for banking and FinTech use cases. Built with modern technologies including FastAPI, LangGraph, Next.js, and integrated with both OpenAI and AWS Bedrock for optimal cost and performance.

## Project Overview

SmartFinance AI demonstrates a production-ready architecture for handling diverse customer inquiries by routing them to specialized AI agents, each employing different retrieval strategies (RAG, CAG, and Hybrid) tailored to their specific needs.

### Key Features

- **Multi-Agent AI System**: Hierarchical agent workflow with intelligent routing
- **Three Specialized Agents**:
  - Billing & Transactions Agent (Hybrid RAG/CAG)
  - Technical Support Agent (Pure RAG)
  - Policy & Compliance Agent (Pure CAG)
- **Modern Frontend**: Beautiful Next.js interface with glassmorphism, gradients, and smooth animations
- **Rewards System**: Track points and tier progression (Silver/Gold/Platinum)
- **Savings Goals**: Visual progress tracking with celebration animations
- **Accessibility**: Audio assistance for hearing impaired users
- **Real-time Streaming**: Token-by-token response display using Server-Sent Events

## Technology Stack

### Backend
- **Framework**: Python 3.10+ with FastAPI
- **AI/LLM Framework**: LangChain & LangGraph
- **Vector Database**: ChromaDB (persistent)
- **LLM Providers**:
  - OpenAI (GPT-4 for response generation)
  - AWS Bedrock (Claude 3 Haiku for routing)

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: shadcn/ui with Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
SmartFinance AI/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── billing_agent.py          # Hybrid RAG/CAG agent
│   │   │   ├── technical_support_agent.py # Pure RAG agent
│   │   │   ├── policy_agent.py           # Pure CAG agent
│   │   │   └── orchestrator.py           # LangGraph routing logic
│   │   ├── api/
│   │   │   └── chat.py                   # FastAPI endpoints
│   │   ├── models/
│   │   │   └── schemas.py                # Pydantic models
│   │   ├── services/
│   │   │   └── vector_store.py           # ChromaDB service
│   │   └── main.py                       # FastAPI application
│   ├── data/
│   │   └── mock_documents/               # Sample financial documents
│   ├── ingest_data.py                    # Data ingestion pipeline
│   ├── requirements.txt
│   └── .gitignore
├── frontend/
│   ├── app/
│   │   ├── page.tsx                      # Dashboard
│   │   ├── rewards/page.tsx              # Rewards system
│   │   ├── goals/page.tsx                # Savings goals
│   │   ├── support/page.tsx              # AI chat interface
│   │   ├── profile/page.tsx              # User profile
│   │   └── layout.tsx                    # Root layout
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   ├── BottomNav.tsx                 # Navigation bar
│   │   └── CelebrationModal.tsx          # Achievement animations
│   ├── lib/
│   │   └── utils.ts                      # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
└── README.md
```

## Quick Start

**Everything is ready to use!** Just run:

```powershell
.\start-all.bat
```

This will start both backend and frontend. Then open http://localhost:3000

For detailed setup and troubleshooting, see **[QUICK-START.md](QUICK-START.md)** and **[SETUP-GUIDE.md](SETUP-GUIDE.md)**

---

## Setup Instructions

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- OpenAI API key (**Required**)
- AWS account with Bedrock access (**Optional** - system falls back to OpenAI if not available)

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Create environment file**:
Create a `.env` file in the `backend` directory:
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS Bedrock Configuration (Optional)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_SESSION_TOKEN=your_session_token_here_if_using_temporary_credentials
AWS_DEFAULT_REGION=us-east-1

# Application Configuration
CHROMA_DB_PATH=./chroma_db
ENVIRONMENT=development
```

5. **Ingest mock data into ChromaDB**:
```bash
python ingest_data.py
```

This will process the mock documents and create vector embeddings in ChromaDB.

6. **Run the FastAPI server**:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Keys Setup

### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env` file

### AWS Bedrock Access

1. Log into [AWS Console](https://console.aws.amazon.com/)
2. Navigate to AWS Bedrock service
3. Request model access for Claude 3 Haiku
4. Create IAM user with Bedrock permissions
5. Generate access key and secret key
6. Add credentials to `.env` file

**Note**: AWS Bedrock may require approval for model access. This can take a few hours.

### Automatic Fallback to OpenAI

**No configuration needed!** The system automatically:
- Tries to use AWS Bedrock Claude for cost-effective routing
- Falls back to OpenAI GPT-3.5-turbo if AWS is unavailable
- Continues working seamlessly either way

You'll see in the backend logs:
```
OpenAI GPT-3.5-turbo initialized for routing
```
or
```
AWS Bedrock initialized successfully
```

## Architecture Details

### Multi-Agent System

The application uses LangGraph to implement a supervisor pattern:

1. **Orchestrator Agent**: Analyzes incoming queries and routes to appropriate specialist
2. **Worker Agents**: Three specialized agents handle specific domains
3. **Stateful Workflow**: Maintains conversation context and session history

### Retrieval Strategies

**Pure RAG (Technical Support Agent)**:
- Always retrieves fresh information from vector store
- Best for dynamic content (troubleshooting, FAQs)
- Uses ChromaDB for semantic search

**Pure CAG (Policy & Compliance Agent)**:
- Uses pre-loaded static policy documents
- No vector search needed - context loaded at initialization
- Fast, consistent responses for regulatory questions

**Hybrid RAG/CAG (Billing Agent)**:
- First query uses RAG to retrieve billing policies
- Caches information for subsequent queries in session
- Optimizes for both accuracy and performance

### Frontend Architecture

- **Server-Side Rendering**: Next.js App Router
- **Streaming Responses**: Real-time token-by-token display using SSE
- **Glassmorphism**: Modern UI with backdrop blur effects
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Audio assistance using Web Speech API

## Usage

### Running the Complete Application

1. **Start Backend** (Terminal 1):
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Testing the AI Agents

Try these sample queries in the Support chat:

**Billing Agent (Hybrid RAG/CAG)**:
- "What are your monthly account fees?"
- "How much is the overdraft fee?"
- "Explain your interest rates"

**Technical Support Agent (Pure RAG)**:
- "I forgot my password, how do I reset it?"
- "The app keeps crashing on startup"
- "How do I enable two-factor authentication?"

**Policy & Compliance Agent (Pure CAG)**:
- "What is your fraud prevention policy?"
- "What are the KYC requirements?"
- "How do you handle unauthorized transactions?"

### Features to Explore

1. **Dashboard**: View balance, savings progress, rewards points, transactions
2. **Rewards**: Track tier progression (Silver → Gold → Platinum)
3. **Goals**: Monitor savings goals with visual progress bars
4. **Support**: Chat with AI agents with streaming responses
5. **Profile**: Manage account settings and preferences
6. **Accessibility**: Enable audio assistance for hearing impaired users

## Accessibility Features

The application includes several accessibility features:

- **Audio Assistance**: Toggle audio to have AI responses read aloud using text-to-speech
  - Click the speaker icon in the Support tab header
  - Icon turns green when enabled
  - Works with both backend AI and local fallback mode
  - Syncs with your profile settings
- **Connection Status**: Visual indicator shows when backend AI is active
  - Green dot = "Full Agentic AI Active"
  - Yellow dot = "Local AI Mode"
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **High Contrast**: Clear visual hierarchy with sufficient contrast
- **Large Touch Targets**: Mobile-friendly button sizes
- **Graceful Degradation**: App works even when backend is unavailable

## API Endpoints

### Chat Endpoints

**POST /api/chat**
- Non-streaming chat endpoint
- Returns complete response at once

```json
{
  "message": "What are your account fees?",
  "session_id": "optional-session-id",
  "user_id": "optional-user-id"
}
```

**POST /api/chat/stream**
- Streaming chat endpoint using Server-Sent Events
- Returns token-by-token response

**GET /api/health**
- Health check endpoint

## Development Notes

### Adding New Documents

To add new documents to the knowledge base:

1. Add text files to `backend/data/mock_documents/`
2. Update `backend/ingest_data.py` to include new documents
3. Run the ingestion pipeline: `python ingest_data.py`

### Customizing Agents

Each agent can be customized in `backend/app/agents/`:
- Modify system prompts
- Adjust retrieval strategies
- Change LLM models and parameters

### Frontend Customization

- **Colors**: Edit `frontend/tailwind.config.ts`
- **Components**: Modify files in `frontend/components/`
- **Pages**: Update files in `frontend/app/`

## Performance Optimization

- **Caching**: Session-based caching in Billing Agent reduces API calls
- **Streaming**: Real-time response display improves perceived performance
- **Vector Search**: ChromaDB provides fast semantic search
- **Model Selection**: Cost-effective models for routing, powerful models for generation

## Security Considerations

- API keys stored in environment variables
- CORS configured for specific origins
- Session isolation for user queries
- No sensitive data logged

## Future Enhancements

- User authentication and authorization
- Transaction history analysis
- Budget recommendations
- Voice input for accessibility
- Mobile native apps (iOS/Android)
- Multi-language support
- Advanced analytics dashboard

## License

This project is licensed under the MIT License.

---

**Note**: This is a demonstration project. Do not use in production without proper security audits, compliance reviews, and testing.
