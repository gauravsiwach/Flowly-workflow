import os
import json
from langchain.tools.ddg_search import DuckDuckGoSearchRun
from openai import OpenAI
# from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup, Tag
import time
import asyncio
from redis_client import get_user_openai_key_sync

# load_dotenv()

def fetch_first_duckduckgo_result(query):
    url = "https://html.duckduckgo.com/html/"
    params = {"q": query}
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.post(url, data=params, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.find_all('a', class_='result__a')
        if results:
            first_link = results[0]
            if isinstance(first_link, Tag):
                href = first_link.get('href')
                return href
            else:
                return None
    except Exception as e:
        pass
    return None

def fetch_page_content(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        article = soup.find('article')
        if article:
            return article.get_text(separator='\n', strip=True)
        body = soup.find('body')
        if body:
            return body.get_text(separator='\n', strip=True)
        return soup.get_text(separator='\n', strip=True)
    except Exception as e:
        return ""

def blog_researcher(state: dict) -> dict:
    """
    Takes a blog topic/question and optional reference URL from state['node_input'] (JSON),
    performs web research, and summarizes findings for blog writing, using the reference blog style if provided.
    """
    # Parse node_input as JSON
    try:
        node_input = json.loads(state.get('node_input', '{}'))
        topic = node_input.get('input', '')
        ref_url = node_input.get('refURL', '')
    except Exception:
        topic = state.get('node_input', '')
        ref_url = ''
    if not topic:
        state['node_result'] = 'No topic provided.'
        return state

    # Fetch reference blog content if provided
    ref_content = ''
    if ref_url:
        ref_content = fetch_page_content(ref_url)

    # DuckDuckGo HTML scrape for first result
    first_url = fetch_first_duckduckgo_result(topic)
    time.sleep(2)  # Be polite to DuckDuckGo
    search_content = fetch_page_content(first_url) if first_url else ''
    if not isinstance(search_content, str) or search_content is None:
        search_content = ''
    if not first_url or not search_content:
        state['node_result'] = 'No content found from search.'
        return state

    # Prepare LLM prompt
    if ref_content:
        SYSTEM_PROMPT = f"""
        You are a research assistant for blog writers. Given the following web page content and a reference blog, extract and summarize the most important facts, trends, and insights relevant to the topic: '{topic}'.
        Use the reference blog as a style and structure guide.
        Reference Blog Content:
        {ref_content[:2000]}
        Web Page Content:
        {search_content[:2000]}
        Organize the output as:
        - Try to match the tone and structure of the reference blog.
        """
    else:
        SYSTEM_PROMPT = f"""
        You are a research assistant for blog writers. Given the following web page content, extract and summarize the most important facts, trends, and insights relevant to the topic: '{topic}'.
        Web Page Content:
        {search_content[:2000]}
        Organize the output as:
        - Brief Introduction
        - Key Findings (bullet points)
        """
    user_id = state.get("user_id")
    openai_key = None
    if user_id:
        openai_key = get_user_openai_key_sync(user_id)
    if not openai_key:
        state["node_result"] = "Error: OpenAI key not found for user."
        return state
    client = OpenAI(api_key=openai_key)
    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT}
            ],
            timeout=30
        )
        summary = response.choices[0].message.content
        state['node_result'] = summary
    except Exception as e:
        state['node_result'] = f'Error during summarization: {str(e)}'
    return state 