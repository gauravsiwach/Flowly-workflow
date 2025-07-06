# 🧠 Flowly: Visual Workflow Automation (Monorepo)

Flowly is a visual workflow automation platform inspired by n8n. It lets you build, connect, and run custom workflows using a modern drag-and-drop interface (frontend) and a powerful, extensible backend API. Automate tasks like fetching web content, summarizing with AI, sending emails, and more—all visually!

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🚀 Features

- Visual workflow builder (React Flow UI)
- FastAPI-based backend for workflow execution
- Node-based extensibility (add your own logic)
- Built-in nodes: Fetch HTML, Summarize, Send Email, Get Weather, News, and more
- Email sending via Gmail SMTP (secure, see setup)
- CORS enabled for easy frontend-backend integration
- Workflow templates and custom node types

---

## 🛠 Tech Stack

### Backend (WebApi)
- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Workflow Engine:** langgraph
- **AI/LLM Integration:** OpenAI API
- **Web Scraping:** requests, BeautifulSoup
- **Email:** smtplib, Gmail SMTP
- **RSS/News:** feedparser
- **Environment:** python-dotenv

### Frontend (WebApp)
- **Language:** JavaScript (ES2020+), React 19+
- **UI/Workflow:** React Flow (via @xyflow/react)
- **Styling:** CSS Modules, custom themes
- **Icons:** lucide-react
- **Notifications:** react-toastify
- **Build Tool:** Vite
- **State/Context:** React Context API

---

## 📦 Monorepo Structure

```
Flowly-workflow/
  ├── WebApi/    # Backend (FastAPI, Python)
  └── WebApp/    # Frontend (React, React Flow)
```

- **WebApi/**: Backend API for executing and streaming workflow graphs
- **WebApp/**: Visual workflow editor and runner (React)

---

## 🛠 Quick Start

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd Flowly-workflow
```

### 2. Backend Setup (WebApi)
```bash
cd WebApi
python -m venv venv
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
```

- Create a `.env` file in `WebApi`:
  ```env
  GMAIL_EMAIL=your_email@gmail.com
  GMAIL_APP_PASSWORD=your_16_character_app_password
  OPENAI_API_KEY=sk-...
  ```
  - For Gmail setup, see [WebApi/EMAIL_SETUP.md](./WebApi/EMAIL_SETUP.md).

- Run the backend:
  ```bash
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```
  The API will be available at [http://localhost:8000](http://localhost:8000).

### 3. Frontend Setup (WebApp)
```bash
cd ../WebApp
npm install
npm run dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).
- Make sure the backend is running!
- If you need to change the backend URL, update the API endpoint in `src/services/workflowService.js`.

---

## 🧩 Workflow Concepts

- **Nodes**: Each block (e.g., Fetch HTML, Summarize, Send Email) is a node. Nodes can have inputs, outputs, and custom logic.
- **Edges**: Connect nodes to define execution order.
- **Templates**: Pre-built workflows for common use cases (e.g., News Update Email).
- **Execution**: Run the workflow and see results for each node, including HTML previews and email sending.

### Example Node Types
| Title                    | Purpose                        | Example Input            |
|--------------------------|--------------------------------|-------------------------|
| Get Weather              | Fetch weather info             | `New York`              |
| Fetch HTML Content       | Load web page HTML             | `https://example.com`   |
| Summarize HTML Content   | Extract core content           | -                       |
| Convert to HTML Template | Format into HTML               | Summary / Weather data  |
| Send Email               | Email the generated content    | `user@example.com`      |

---

## 🔑 Environment Variables

| Key                | Description                        |
|--------------------|------------------------------------|
| GMAIL_EMAIL        | Gmail address for sending emails    |
| GMAIL_APP_PASSWORD | Gmail app password (16 chars)      |
| OPENAI_API_KEY     | OpenAI API key for LLM features    |

---

## 📚 API Endpoints (Backend)
- `POST /run-graph` — Run a workflow graph and get the result
- `POST /run-graph-stream` — Run a workflow graph and stream node-by-node results
- `GET /health` — Health check

See `WebApi/main.py` for request/response formats.

---

## 🛠 Troubleshooting
- **Email not working?** Double-check your `.env` and see [WebApi/EMAIL_SETUP.md](./WebApi/EMAIL_SETUP.md).
- **OpenAI errors?** Make sure your `OPENAI_API_KEY` is valid and in `.env`.
- **CORS or connection errors?** Make sure the backend is running and accessible from the frontend.
- **Blank page or frontend errors?** Make sure the backend is running and accessible.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

Copyright (c) 2024 Gaurav Siwach <gauravsiwach2008@gmail.com>

---

## 👤 Author

Gaurav Siwach  
[gauravsiwach2008@gmail.com](mailto:gauravsiwach2008@gmail.com) 