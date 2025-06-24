def send_email(state: dict) -> dict:
    print("📧 send_email...")
    content = state.get("node_result") or state.get("node_input")
    to_email = "example@example.com"  # Placeholder
    # Simulate sending email
    print(f"Sending email to: {to_email}")
    state["node_result"] = True
    return state 