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
    graph_builder = build_graph_from_user_input(workflow_input, user_id=user_id)
    graph = graph_builder.compile()
    result_stream = graph.stream(state)
    results = []
    for node_input_config, node_output_state in zip(workflow_input, result_stream):
        # Patch: Ensure user_id is always present in node_output_state
        if "user_id" in state and (isinstance(node_output_state, dict) and "user_id" not in node_output_state):
            node_output_state["user_id"] = state["user_id"]
        # Robust flattening: find function name key and flatten even if extra keys exist
        function_keys = [k for k in node_output_state.keys() if k in function_map.values() or k in function_map.keys()]
        if function_keys:
            key = function_keys[0]
            inner = node_output_state[key]
            if isinstance(inner, dict):
                inner["node_id"] = node_input_config["node_id"]
                inner["node_name"] = node_input_config.get("node_name", "")
                if "user_id" in state and "user_id" not in inner:
                    inner["user_id"] = state["user_id"]
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
    graph_builder = build_graph_from_user_input(workflow_input, user_id=user_id)
    graph = graph_builder.compile()
    result_stream = graph.stream(state)
    for node_input_config, node_output_state in zip(workflow_input, result_stream):
        # Robust flattening: find function name key and flatten even if extra keys exist
        function_keys = [k for k in node_output_state.keys() if k in function_map.values() or k in function_map.keys()]
        if function_keys:
            key = function_keys[0]
            inner = node_output_state[key]
            if isinstance(inner, dict):
                inner["node_id"] = node_input_config["node_id"]
                inner["node_name"] = node_input_config.get("node_name", "")
                if "user_id" in state and "user_id" not in inner:
                    inner["user_id"] = state["user_id"]
                yield json.dumps({"results": inner, "additional_input": additional_input or []}) + "\n"
                continue
        if "user_id" in state and "user_id" not in node_output_state:
            node_output_state["user_id"] = state["user_id"]
        node_output_state["node_id"] = node_input_config["node_id"]
        node_output_state["node_name"] = node_input_config.get("node_name", "")
        yield json.dumps({"results": node_output_state, "additional_input": additional_input or []}) + "\n"


# execute_graph_flow([
#     {"node_id":"8c5a1f02-d0cd-4c6d-96b6-51f1bc1f0b17", "node_name": "fetch_html_content", "seq": 1, "node_input": "www.google.com", "node_result":""},
#     ])
 


 