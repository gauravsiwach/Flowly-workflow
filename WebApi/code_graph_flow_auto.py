import json
from typing_extensions import TypedDict
from builder.graph_builder import build_graph_from_user_input
from mapping.node_mapping import function_map, node_functions

class State(TypedDict):
    node_input: str
    node_result: str
    node_id: str
    node_name: str
    additional_input: list

def execute_graph_flow_test(workflow_input, additional_input=None):
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


def execute_graph_flow(workflow_input, additional_input=None, user_id=None):
    state = {
         "node_input": None,
         "node_result": None,
         "node_id": None,
         "node_name": None,
         "additional_input": additional_input or [],
         "user_id": user_id,
    }
    for step in workflow_input:
        if "node_input" in step:
            state["node_input"] = step["node_input"]
            break
    graph_builder = build_graph_from_user_input(workflow_input)
    graph = graph_builder.compile()
    result_stream = graph.stream(state)
    results = []
    for node_input_config, node_output_state in zip(workflow_input, result_stream):
        # Flatten if node_output_state is wrapped in a key
        if isinstance(node_output_state, dict) and len(node_output_state) == 1:
            inner = list(node_output_state.values())[0]
            if isinstance(inner, dict):
                inner["node_id"] = node_input_config["node_id"]
                inner["node_name"] = node_input_config.get("node_name", "")
                results.append(inner)
                continue
        node_output_state["node_id"] = node_input_config["node_id"]
        node_output_state["node_name"] = node_input_config.get("node_name", "")
        results.append(node_output_state)
    # print("✅ All states:", results)
    return {"results": results, "additional_input": state["additional_input"]}


def execute_graph_flow_stream(workflow_input, additional_input=None, user_id=None):
    state = {
         "node_input": None,
         "node_result": None,
         "node_id": "",
         "node_name": "",
         "additional_input": additional_input or [],
         "user_id": user_id,
    }
    for node_input_config in workflow_input:
        if "node_input" in node_input_config:
            state["node_input"] = node_input_config["node_input"]
            state["node_id"] = node_input_config["node_id"]
            state["node_name"] = function_map.get(node_input_config["node_id"], "")
            break
    graph_builder = build_graph_from_user_input(workflow_input)
    graph = graph_builder.compile()
    result_stream = graph.stream(state)
    for node_input_config, node_output_state in zip(workflow_input, result_stream):
        # Flatten if node_output_state is wrapped in a key
        if isinstance(node_output_state, dict) and len(node_output_state) == 1:
            inner = list(node_output_state.values())[0]
            if isinstance(inner, dict):
                inner["node_id"] = node_input_config["node_id"]
                inner["node_name"] = node_input_config.get("node_name", "")
                yield json.dumps({"results": inner, "additional_input": additional_input or []}) + "\n"
                continue
        node_output_state["node_id"] = node_input_config["node_id"]
        node_output_state["node_name"] = node_input_config.get("node_name", "")
        yield json.dumps({"results": node_output_state, "additional_input": additional_input or []}) + "\n"


# execute_graph_flow([
#     {"node_id":"8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17", "node_name": "fetch_html_content", "seq": 1, "node_input": "www.google.com", "node_result":""},
#     ])
 


 