# SMTP Email Configuration Guide

This guide explains how to configure SMTP email sending for the User Account Microservice.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=no-reply@salar.in
```

## Popular SMTP Providers

### 1. Gmail SMTP

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Setup Instructions:**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated 16-character password as `SMTP_PASSWORD`

### 2. Outlook/Hotmail SMTP

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### 3. Yahoo SMTP

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

### 4. Custom SMTP Server

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

## Security Considerations

1. **Use App Passwords**: For Gmail, Yahoo, and other providers, use app passwords instead of your main password
2. **Environment Variables**: Never hardcode SMTP credentials in your code
3. **SSL/TLS**: Use `SMTP_SECURE=true` for port 465, `false` for port 587
4. **Firewall**: Ensure your server can connect to the SMTP port

## Testing SMTP Connection

You can test your SMTP configuration by running:

```bash
npm run start:dev
```

The service will attempt to create the SMTP transporter on startup. Check the console for any connection errors.

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Verify your username and password
   - For Gmail, ensure you're using an App Password
   - Check if 2FA is enabled (required for App Passwords)

2. **Connection Timeout**
   - Verify the SMTP host and port
   - Check firewall settings
   - Ensure the SMTP server is accessible from your network

3. **SSL/TLS Issues**
   - Try different `SMTP_SECURE` values (true/false)
   - Verify the correct port for your SMTP provider

4. **Rate Limiting**
   - Some providers have sending limits
   - Gmail: 500 emails/day for regular accounts
   - Consider using a dedicated email service for production

## Production Recommendations

For production environments, consider:

1. **Dedicated Email Services**: SendGrid, Mailgun, Amazon SES
2. **Email Templates**: Use HTML templates for better formatting
3. **Email Queuing**: Implement retry logic for failed emails
4. **Monitoring**: Log email sending success/failure rates
5. **SPF/DKIM**: Configure proper email authentication

## Example Usage

The email service is automatically injected into the UserService and can be used like this:

```typescript
// In your service
constructor(private emailService: EmailService) {}

// Send OTP
await this.emailService.sendOtp(userEmail, otpCode);

// Send custom email
await this.emailService.sendEmail(
  'user@example.com',
  'Welcome to Salar',
  'Welcome text',
  '<h1>Welcome to Salar</h1>'
);
``` 