# 🧠 Flowly: Visual Workflow Builder

This app is a **visual workflow editor** built with [React Flow](https://reactflow.dev/). It lets you create, configure, and connect nodes that represent steps in a process (like `fetch_html_content → summarize → convert → send_email`) — and later run these workflows using the **Flowly backend API**.

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🚀 Features

- 🧱 **Drag-and-drop Nodes**: Add custom logic blocks like "Fetch HTML", "Summarize", "Send Email", etc.
- 🔌 **Visual Connections**: Link nodes together to define execution flow.
- 🖼️ **Custom Node UI**: Input titles, labels, and dynamic fields per node.
- 📬 **Workflow Execution**: Connects to a Python FastAPI backend for workflow execution.

---

## 🛠 Quick Start (Frontend)

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd N8N_WebApp
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

4. **Make sure the backend is running!**
   - See [../WebApi/README.md](../WebApi/README.md) for backend setup.
   - The frontend expects the backend API to be available (default: `http://localhost:8000`).
   - If you need to change the backend URL, update the API endpoint in `src/services/workflowService.js`.

---

## 🧩 Node Types

| Title                    | Purpose                        | Example Input            |
|--------------------------|--------------------------------|---------------------------|
| Get Weather              | Fetch weather info             | `New York`               |
| Fetch HTML Content       | Load web page HTML             | `https://example.com`    |
| Summarize HTML Content   | Extract core content           | -                         |
| Convert to HTML Template | Format into HTML               | Summary / Weather data   |
| Send Email               | Email the generated content    | `user@example.com`       |

---

## 🛠 Troubleshooting
- **Blank page or errors?** Make sure the backend is running and accessible.
- **CORS errors?** The backend must have CORS enabled (it is by default).
- **API errors?** Check the backend logs for details.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

Copyright (c) 2024 Gaurav Siwach <gauravsiwach2008@gmail.com>

---

## 👤 Author

Gaurav Siwach  
[gauravsiwach2008@gmail.com](mailto:gauravsiwach2008@gmail.com)
