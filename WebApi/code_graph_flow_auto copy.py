from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Literal
import requests
from bs4 import BeautifulSoup

load_dotenv()

client = OpenAI()


class State(TypedDict):
    node_input: str
    node_result: str
 
class classifyMessageResponse(BaseModel):
    type: Literal["weather_query", "html_query"]
    input: str
 
def classify_query(state: State) -> Literal["weather_query", "html_query"]:
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
    # use pydantic to validate the response
    # sturctured response
    response = client.beta.chat.completions.parse(
        model="gpt-4.1-nano",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query}
        ],
        response_format=classifyMessageResponse
    )
    parsed =response.choices[0].message.parsed
    state["node_result"] = parsed
    
    return state
 

def get_weather(state: dict) -> dict:
    print("🌤️ get_weather...")
    city = state.get("node_result") or state.get("node_input") 
    url = f"https://wttr.in/{city}?format=%C+%t"
    response = requests.get(url)
    if response.status_code == 200:
        state["node_result"] = f"weather in {city} is {response.text}."
    return state

def fetch_html_content(state: dict) -> dict:
    print("🌐 fetch_html_content...")
    url = state.get("node_result") or state.get("node_input") 

    try:
        if not url.startswith("http"):
            url = "http://" + url  # default to http if scheme is missing

        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise HTTPError for bad responses
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        state["node_result"] = text

    except Exception as e:
        print(f"❌ Error fetching HTML: {e}")
        state["node_result"] = "Error fetching the content."

    return state

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

def convert_to_html_template(state: dict) -> dict:
    print("🧾 convert_to_html_template...")
    try:
        content = state.get("node_result") or state.get("node_input")
        html_template = f"""
        <html>
            <head><title>Summary Report</title></head>
            <body>
                <h1>Summary</h1>
                <p>{content}</p>
            </body>
        </html>
        """
        state["node_result"] = html_template
    except Exception as e:
        print(f"❌ Error generating HTML template: {e}")
        state["node_result"] = "<p>Error generating HTML template</p>"

    return state

def send_email(state: dict) -> dict:
    print("📧 send_email...")
    content = state.get("node_result") or state.get("node_input")
    to_email = "example@example.com"  # Placeholder

    # Simulate sending email
    print(f"Sending email to: {to_email}")

    state["node_result"] = True
    return state

# binding node name with guid
function_map = {
    "fdc3b924-2f2a-43e8-923f-3f118a51eb0e": "get_weather",
    "1a7c2b8e-e4ae-4c8e-b2c4-999b4b3cf80d": "convert_to_html_template",
    "6789d23f-1352-4b11-b9a3-2f4f6f96fcd0": "send_email",
    "8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17": "fetch_html_content",
    "0ff35b88-681c-4c64-94b5-7b74dbfbb471": "summarize_html_content"
}
# binding name name with actual method node
node_functions = {
    "get_weather": get_weather,
    "convert_to_html_template": convert_to_html_template,
    "send_email": send_email,
    "fetch_html_content": fetch_html_content,
    "summarize_html_content": summarize_html_content,
}

def build_graph_from_user_input(user_input_steps: list[dict]) -> StateGraph:
    graph_builder = StateGraph(State)

    # Extract ordered node names
    # ordered_nodes = [step["node_id"] for step in sorted(user_input_steps, key=lambda x: x["seq"])]
    ordered_nodes = [
        function_map[step["node_id"]] 
        for step in sorted(user_input_steps, key=lambda x: x["seq"])
    ]

    # Add all required nodes
    for node_name in ordered_nodes:
        if node_name in node_functions:
            graph_builder.add_node(node_name, node_functions[node_name])
        else:
            raise ValueError(f"Unknown node_id: {node_name}")

    # Add edges
    graph_builder.add_edge(START, ordered_nodes[0])
    for i in range(len(ordered_nodes) - 1):
        graph_builder.add_edge(ordered_nodes[i], ordered_nodes[i + 1])
    graph_builder.add_edge(ordered_nodes[-1], END)

    return graph_builder


def execute_graph_flow(workflow_input):
    state = {
         "node_input": None,
         "node_result": None
    }
    for step in workflow_input:
        if "node_input" in step:
            state["node_input"] = step["node_input"]
            break
    
    graph_builder = build_graph_from_user_input(workflow_input)
    graph = graph_builder.compile()

    result = graph.invoke(state)
    print("✅ Final result:", result)
    return result



# execute_graph_flow([
#     {"node_id":"8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17", "node_name": "fetch_html_content", "seq": 1, "node_input": "www.google.com", "node_result":""},
#     ])
 


 