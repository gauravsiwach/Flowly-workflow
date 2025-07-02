import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.email_config import SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD

def send_email(state: dict) -> dict:
    """
    Send email using SMTP with simple configuration and error handling.
    """
    print("📰 email sending...")
    try:
        # Check configuration
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            state["node_result"] = "Error: Email configuration missing"
            return state
        
        #email node , node id
        send_email_node_id = "6789d23f-1352-4b11-b9a3-2f4f6f96fcd0"
        
        # Get recipient email from additional_input
        additional_input = state.get("additional_input", [])
        
        # Find send_email input in additional_input
        recipient_email = None
        for item in additional_input:
            if item.get("node_id") == send_email_node_id:
                recipient_email = item.get("node_input", "").strip()
                break
        
        if not recipient_email:
            state["node_result"] = "Error: Recipient email address not provided"
            return state
        
        html_content = state.get("node_result", "")
        
        if not html_content:
            state["node_result"] = "Error: No HTML content to send"
            return state
        
        # Create and send email
        message = MIMEMultipart("alternative")
        message["Subject"] = "Workflow Generated Content"
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        
        # Add plain text fallback first (less preferred)
        text_part = MIMEText("This email contains HTML content. Please view in an HTML-compatible email client.", "plain", "utf-8")
        message.attach(text_part)
        
        # Add HTML content second (more preferred - Gmail will choose this)
        html_part = MIMEText(html_content, "html", "utf-8")
        message.attach(html_part)
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=ssl.create_default_context())
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(message)
        
        state["node_result"] = f"Email sent successfully to {recipient_email}"
        # Propagate node_input for streaming
        state["node_input"] = recipient_email
        return state
        
    except Exception as e:
        state["node_result"] = f"Error: Failed to send email - {str(e)}"
        # Propagate node_input even on error
        state["node_input"] = recipient_email if 'recipient_email' in locals() else None
        return state 