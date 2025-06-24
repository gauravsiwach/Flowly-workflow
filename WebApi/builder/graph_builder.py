from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict
from mapping.node_mapping import function_map, node_functions

class State(TypedDict):
    node_input: str
    node_result: str

def build_graph_from_user_input(user_input_steps: list[dict]) -> StateGraph:
    graph_builder = StateGraph(State)
    ordered_nodes = [
        function_map[step["node_id"]]
        for step in sorted(user_input_steps, key=lambda x: x["seq"])
    ]
    for node_name in ordered_nodes:
        if node_name in node_functions:
            graph_builder.add_node(node_name, node_functions[node_name])
        else:
            raise ValueError(f"Unknown node_id: {node_name}")
    graph_builder.add_edge(START, ordered_nodes[0])
    for i in range(len(ordered_nodes) - 1):
        graph_builder.add_edge(ordered_nodes[i], ordered_nodes[i + 1])
    graph_builder.add_edge(ordered_nodes[-1], END)
    return graph_builder 