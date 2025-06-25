from pydantic import BaseModel
from typing import Literal
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

class classifyMessageResponse(BaseModel):
    type: Literal["weather_query", "html_query"]
    input: str

def classify_query(state: dict) -> dict:
    print("🔀 classify_query...")
    query = state.get("node_result") or state.get("node_input")
    SYSTEM_PROMPT = """
    You are a helpful ai assistant, and your job is to detect what is user's query is
    related to.
    example:
      weather_query,
      html_query

    return the response in specified JSON boolean only.
    json value of result:
    
    example 1:
        user query: what is the weather of meerut city, what is the team of meerut, hows the weather of meerut.
        response:  {"type": "weather_query", input: "meerut"}
    example 2:
        user query: i want summary from this page, "www.google.com".
        response:  {"type": "html_query", input: "www.google.com"}

    """
    response = client.beta.chat.completions.parse(
        model="gpt-4.1-nano",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query}
        ],
        response_format=classifyMessageResponse
    )
    parsed = response.choices[0].message.parsed
    state["node_result"] = parsed
    return state 