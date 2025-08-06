# Environment Setup Guide

## Step 1: Create .env file

Create a `.env` file in the root directory of the user-account-microservice with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/user-microservice

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=no-reply@salar.in

# SMS Configuration (Bulk SMS Gateway)
SMS_USER=your-sms-username
SMS_PASSWORD=your-sms-password
SMS_SENDER=your-sms-sender-id
SMS_TRANS_PASSWORD_OTP_TEMPLATEID=your-sms-template-id

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Step 2: Configure SMTP Settings

### For Gmail (Recommended for testing):

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a 16-character password
3. **Update your .env file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-actual-gmail@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   SMTP_FROM=your-actual-gmail@gmail.com
   ```

### For Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

### For Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@yahoo.com
```

## Step 3: Test Configuration

After setting up your .env file, run the SMTP test:

```bash
# Navigate to the project directory
cd user-account-microservice

# Run the SMTP test
npx ts-node test/smtp-test.ts
```

## Step 4: Verify Results

The test will output one of these results:

✅ **Success**: "SMTP configuration is working correctly!"
❌ **Failure**: "SMTP configuration failed: [error message]"

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Verify your email and password
   - For Gmail: Ensure you're using an App Password, not your regular password
   - Check if 2FA is enabled (required for App Passwords)

2. **Connection Timeout**
   - Verify SMTP_HOST and SMTP_PORT
   - Check firewall settings
   - Ensure internet connection

3. **SSL/TLS Issues**
   - Try SMTP_SECURE=false for port 587
   - Try SMTP_SECURE=true for port 465

## Next Steps

Once SMTP is working:
1. Start the microservice: `npm run start:dev`
2. Test the OTP functionality through the API endpoints
3. Monitor email delivery in your inbox 