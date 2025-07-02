# Flowly Backend (WebApi)

This is the backend API for the Flowly visual workflow builder. It provides endpoints to execute and stream workflow graphs, and supports custom nodes for tasks like fetching HTML, summarizing content, sending emails, and more.

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🚀 Features

- FastAPI-based REST API
- Workflow execution and streaming endpoints
- Node-based extensibility (add your own logic)
- Email sending (Gmail SMTP, see EMAIL_SETUP.md)
- CORS enabled for frontend integration

---

## 🛠 Quick Start (Backend)

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd WebApi
   ```
2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Linux/macOS:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Create a `.env` file in the `WebApi` directory:**
   Example:
   ```env
   GMAIL_EMAIL=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_16_character_app_password
   OPENAI_API_KEY=sk-...
   ```
   - For Gmail setup, see [EMAIL_SETUP.md](./EMAIL_SETUP.md).
   - Never commit your `.env` file to version control!

5. **Run the backend API:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at [http://localhost:8000](http://localhost:8000).

---

## 🔑 Required Environment Variables (.env)

| Key                | Description                        |
|--------------------|------------------------------------|
| GMAIL_EMAIL        | Gmail address for sending emails    |
| GMAIL_APP_PASSWORD | Gmail app password (16 chars)      |
| OPENAI_API_KEY     | OpenAI API key for LLM features    |

---

## 📚 API Endpoints

- `POST /run-graph` — Run a workflow graph and get the result
- `POST /run-graph-stream` — Run a workflow graph and stream node-by-node results
- `GET /health` — Health check

See `main.py` for request/response formats.

---

## 🛠 Troubleshooting
- **Email not working?** Double-check your `.env` and see [EMAIL_SETUP.md](./EMAIL_SETUP.md).
- **OpenAI errors?** Make sure your `OPENAI_API_KEY` is valid and in `.env`.
- **CORS or connection errors?** Make sure the backend is running and accessible from the frontend.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

Copyright (c) 2024 Gaurav Siwach <gauravsiwach2008@gmail.com>

---

## 👤 Author

Gaurav Siwach  
[gauravsiwach2008@gmail.com](mailto:gauravsiwach2008@gmail.com) 