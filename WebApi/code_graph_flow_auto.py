import json
from typing_extensions import TypedDict
from builder.graph_builder import build_graph_from_user_input
from mapping.node_mapping import function_map, node_functions

class State(TypedDict):
    node_input: str
    node_result: str
    node_id: str
    node_name: str

def execute_graph_flow(workflow_input, additional_input=None):
    state = {
         "node_input": None,
         "node_result": None,
         "node_id": None,
         "node_name": None,
         "additional_input": additional_input or []
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


def execute_graph_flow_stream(workflow_input, additional_input=None):
    state = {
         "node_input": None,
         "node_result": None,
         "node_id": None,
         "node_name": None,
         "additional_input": additional_input or []
    }
    for step in workflow_input:
        if "node_input" in step:
            state["node_input"] = step["node_input"]
            break
    graph_builder = build_graph_from_user_input(workflow_input)
    graph = graph_builder.compile()
    result_stream = graph.stream(state)
    results = []
    for step, event in zip(workflow_input, result_stream):
        # Flatten if event is wrapped in a key
        if isinstance(event, dict) and len(event) == 1:
            inner = list(event.values())[0]
            if isinstance(inner, dict):
                inner["node_id"] = step["node_id"]
                inner["node_name"] = step.get("node_name", "")
                results.append(inner)
                continue
        event["node_id"] = step["node_id"]
        event["node_name"] = step.get("node_name", "")
        results.append(event)
    print("✅ All states:", results)
    return {"results": results, "additional_input": state["additional_input"]}


def stream_graph_flow(workflow_input):
    state = {
         "node_input": None,
         "node_result": None,
         "node_id": None,
         "node_name": None
    }
    for step in workflow_input:
        if "node_input" in step:
            state["node_input"] = step["node_input"]
            break
    graph_builder = build_graph_from_user_input(workflow_input)
    graph = graph_builder.compile()
    ordered_steps = sorted(workflow_input, key=lambda x: x["seq"])
    result_stream = graph.stream(state, stream_mode="values")
    for step, event in zip(ordered_steps, result_stream):
        event["node_id"] = step["node_id"]
        event["node_name"] = step.get("node_name", "")
        yield json.dumps(event) + "\n"


# execute_graph_flow([
#     {"node_id":"8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17", "node_name": "fetch_html_content", "seq": 1, "node_input": "www.google.com", "node_result":""},
#     ])
 


 