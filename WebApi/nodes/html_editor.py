def html_editor(state: dict) -> dict:
    """
    HTML Editor node - passes through HTML content from previous node.
    The actual editing happens in the frontend UI.
    """
    try:
        # Get content from previous node result or node input
        content = state.get("node_result") or state.get("node_input")
        
        # Pass through the content (editing happens in frontend)
        state["node_result"] = content
        
    except Exception as e:
        state["node_result"] = f"<p>Error in HTML editor: {str(e)}</p>"
    
    return state
