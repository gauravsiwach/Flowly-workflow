from openai import OpenAI
import os
# from dotenv import load_dotenv
import asyncio
from redis_client import get_user_openai_key_sync

# load_dotenv()

def summarize_html_content(state: dict) -> dict:
    print("📝 summarize_html_content...")
    content = state.get("node_result") or state.get("node_input")
    if content is None:
        content = ""
    user_id = state.get("user_id")
    openai_key = None
    if user_id:
        openai_key = get_user_openai_key_sync(user_id)
    if not openai_key:
        state["node_result"] = "Error: OpenAI key not found for user."
        return state
    client = OpenAI(api_key=openai_key)
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