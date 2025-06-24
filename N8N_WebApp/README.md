# 🧠 Visual Workflow Builder with React Flow + LangGraph

This app is a **visual workflow editor** built with [React Flow](https://reactflow.dev/). It lets you create, configure, and connect nodes that represent steps in a process (like `fetch_html_content → summarize → convert → send_email`) — and later run these workflows using **LangGraph API endpoints**.

---

## 🚀 Features

- 🧱 **Drag-and-drop Nodes**: Add custom logic blocks like "Fetch HTML", "Summarize", "Send Email", etc.
- 🔌 **Visual Connections**: Link nodes together to define execution flow.
- 🖼️ **Custom Node UI**: Input titles, labels, and dynamic fields per node.
- 📬 **Future Integration**: Export the flow to be executed via LangGraph API.

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

## 🛠 Setup

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
npm run dev
