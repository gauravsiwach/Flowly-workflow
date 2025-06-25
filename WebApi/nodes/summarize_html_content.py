from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def summarize_html_content(state: dict) -> dict:
    print("📝 summarize_html_content...")
    content = state.get("node_result") or state.get("node_input")
    SYSTEM_PROMPT = """
    You are a helpful assistant. Summarize the following text into a few key points:
    add some desc or key point if content not found some meaning full.
    give result should be in max 200 words.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": content}
            ]
        )
        summary = response.choices[0].message.content
    except Exception as e:
        print("❌ LLM error:", e)
        summary = "Error while summarizing content."
    state["node_result"] = summary
    return state 