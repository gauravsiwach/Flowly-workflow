import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Email Configuration for Gmail SMTP
# IMPORTANT: You must use an App Password, not your regular Gmail password

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Get email credentials from environment variables
SENDER_EMAIL = os.getenv("GMAIL_EMAIL")
SENDER_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

# Check if credentials are properly configured
if not SENDER_EMAIL or not SENDER_PASSWORD:
    print("⚠️  Email configuration missing!")
   