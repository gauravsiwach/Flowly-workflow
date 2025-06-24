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