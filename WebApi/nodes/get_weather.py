import requests

def get_weather(state: dict) -> dict:
    print("🌤️ get_weather...")
    city = state.get("node_result") or state.get("node_input")
    url = f"https://wttr.in/{city}?format=%C+%t"
    response = requests.get(url)
    if response.status_code == 200:
        state["node_result"] = f"weather in {city} is {response.text}."
    return state 