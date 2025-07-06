import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def template_generator(state: dict) -> dict:
    """Node: Template_Generator. Fetches an HTML template from a URL (from additional_input) and fills it with input content using LLM."""
    try:
        # Read the static template
        try:
            template_path = os.path.join(os.path.dirname(__file__), '../templates/blog_template.html')
            with open(template_path, 'r', encoding='utf-8') as f:
                template_html = f.read()
        except Exception as e:
            state['node_result'] = f"<p>Error reading static template: {e}</p>"
            return state
        # Fill placeholders from node_input/state
        try:
            node_input_obj = json.loads(state.get('node_input', '{}'))
        except Exception:
            node_input_obj = {}
        title = node_input_obj.get('title', 'Blog Title')
        author = node_input_obj.get('author', 'Author')
        date = node_input_obj.get('date', datetime.now().strftime('%Y-%m-%d'))
        topic = node_input_obj.get('topic', '')
        subtopics = node_input_obj.get('subtopics', [])
        content = state.get('node_result', '')
        # Format subtopics for prompt
        if isinstance(subtopics, list):
            subtopics_str = ', '.join(subtopics)
        else:
            subtopics_str = subtopics if subtopics else ''
        # Build LLM prompt
        SYSTEM_PROMPT = f"""
you are a expert blog writer assistant, you have to write a blog on giving content with refecnce with given html template.
lets try to give best readable and user attarctive html blog.
Here is an HTML template:
{template_html}

Here is the content:
- title: {title}
- author: {author}
- date: {date}
- topic: {topic}
- subtopics: {subtopics_str}
- content: {content}

Lets use this content and if anything is missed then filled by your self eg: if title is miss and content about on RAG then 
use the RAG as title

Return the complete HTML page.
"""
        try:
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}],
                timeout=30
            )
            filled_html = response.choices[0].message.content
            state['node_result'] = filled_html
        except Exception as e:
            state['node_result'] = f"<p>Error generating HTML from template (LLM): {e}</p>"
        return state
    except Exception as e:
        state['node_result'] = f"<p>Error generating HTML from template: {e}</p>"
    return state 