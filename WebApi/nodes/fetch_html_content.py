import requests
from bs4 import BeautifulSoup

def fetch_html_content(state: dict) -> dict:
    print("🌐 fetch_html_content...")
    url = state.get("node_result") or state.get("node_input")
    if not url or not isinstance(url, str):
        state["node_result"] = "Invalid or missing URL."
        return state
    try:
        if not url.startswith("http"):
            url = "http://" + url
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        state["node_result"] = text
        print("state-->", state)
    except Exception as e:
        print(f"❌ Error fetching HTML: {e}")
        state["node_result"] = "Error fetching the content."
    return state 