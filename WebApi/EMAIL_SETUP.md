# Gmail SMTP Setup Guide

## Quick Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to Security
3. Enable 2-Step Verification (2FA)

### Step 2: Generate an App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find "App passwords" (under 2-Step Verification)
3. Click "Generate new app password"
4. Select "Mail" as the app
5. Copy the 16-character password (remove spaces)

### Step 3: Configure Email Settings
Create a `.env` file in the WebApi directory:
```bash
GMAIL_EMAIL=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

### Step 4: Test
Run your workflow and the email should be sent successfully!

## How It Works

1. **Input**: Enter recipient email in the Send Email node
2. **Content**: Takes HTML from previous node (Convert to HTML Template)
3. **Sending**: Sends email using Gmail SMTP (TLS on port 587)
4. **Result**: Shows success/error message

## Default Settings

- **SMTP Server**: smtp.gmail.com
- **Port**: 587
- **Security**: TLS enabled
- **Subject**: "Workflow Generated Content"

## Troubleshooting

### Error: "Username and Password not accepted"
- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2FA is enabled on your Gmail account
- Check that the email address is correct

### Error: "Application-specific password required"
- Verify app password is exactly 16 characters (no spaces)
- Make sure 2-Step Verification is enabled
- Regenerate the app password if needed

### Error: "Email configuration missing"
- Check that `.env` file exists in WebApi directory
- Verify `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` are set correctly

### Error: "Recipient email address not provided"
- Enter email address in the Send Email node input
- Check that the node ID matches the send_email mapping

### Error: "No HTML content to send"
- Make sure previous node generated HTML content
- Verify the workflow sequence is correct

### App Password not working
- Regenerate the app password
- Make sure you copied all 16 characters without spaces
- Wait 5-10 minutes after generating (can take time to activate)

## Security Notes

- **Never commit `.env` file** to version control
- **Use App Passwords only** - regular Gmail passwords won't work
- **Keep app passwords secure** - treat them like regular passwords
- **Regenerate app passwords** if compromised

That's it! Simple and secure email setup. 🚀 