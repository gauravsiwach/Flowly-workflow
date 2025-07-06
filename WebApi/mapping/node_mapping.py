from nodes.get_weather import get_weather
from nodes.fetch_html_content import fetch_html_content
from nodes.summarize_html_content import summarize_html_content
from nodes.convert_to_html_template import convert_to_html_template
from nodes.send_email import send_email
from nodes.fetch_top_news import fetch_top_news
from nodes.fetch_it_tech_news import fetch_it_tech_news
from nodes.get_topic_content import get_topic_content
from nodes.blog_researcher import blog_researcher
from nodes.template_generator import template_generator
# from nodes.classify_query import classify_query  # Uncomment if needed

function_map = {
    "fdc3b924-2f2a-43e8-923f-3f118a51eb0e": "get_weather",
    "1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d": "convert_to_html_template",
    "f7e6d5c4-1234-4abc-9def-abcdef123456": "template_generator",
    "6789d23f-1352-4b11-b9a3-2f4f6f96fcd0": "send_email",
    "8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17": "fetch_html_content",
    "0ff35b88-681c-4c64-94b5-7b74dbfbb471": "summarize_html_content",
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890": "fetch_top_news",
    "b2c3d4e5-f6g7-8901-bcde-f23456789012": "fetch_it_tech_news",
    "e3b0c442-98fc-1c14-9afb-4c8996fb9242": "get_topic_content",
    "d4e5f6a7-1234-4bcd-8ef0-abcdef123456": "blog_researcher"
    # Add classify_query if needed
}

node_functions = {
    "get_weather": get_weather,
    "convert_to_html_template": convert_to_html_template,
    "template_generator": template_generator,
    "send_email": send_email,
    "fetch_html_content": fetch_html_content,
    "summarize_html_content": summarize_html_content,
    "fetch_top_news": fetch_top_news,
    "fetch_it_tech_news": fetch_it_tech_news,
    "get_topic_content": get_topic_content,
    "blog_researcher": blog_researcher,
    # "classify_query": classify_query,  # Add if used in your workflow
} 