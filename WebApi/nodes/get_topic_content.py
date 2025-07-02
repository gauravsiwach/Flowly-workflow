import os
from langchain.tools.ddg_search import DuckDuckGoSearchRun

def get_topic_content(state: dict) -> dict:
    """
    Takes a topic name from state['node_input'], searches DuckDuckGo, and returns the top results/snippets.
    """
    topic = state.get('node_input') or ''
    print(f"🔎 get_topic_content running for topic: {topic}")
    if not topic:
        state['node_result'] = 'No topic provided.'
        return state

    search = DuckDuckGoSearchRun()
    try:
        results = search.run(topic)
        # results is a string summary of the top results
        state['node_result'] = results
    except Exception as e:
        state['node_result'] = f'Error during search: {str(e)}'
    return state 