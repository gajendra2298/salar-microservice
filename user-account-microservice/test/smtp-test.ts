import { EmailService } from '../src/user/services/email.service';

async function testSMTP() {
  const emailService = new EmailService();
  
  // Get test email from environment or use default
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  
  try {
    console.log('🧪 Testing SMTP configuration...');
    console.log(`📧 Test email will be sent to: ${testEmail}`);
    console.log('⏳ Sending test email...');
    
    // Test sending a simple email
    const result = await emailService.sendEmail(
      testEmail,
      'SMTP Test Email - User Account Microservice',
      'This is a test email from the User Account Microservice to verify SMTP configuration.',
      `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">✅ SMTP Test Successful!</h1>
            <p>This email confirms that your SMTP configuration is working correctly.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Configuration Details:</h3>
              <ul>
                <li><strong>Host:</strong> ${process.env.SMTP_HOST || 'Not set'}</li>
                <li><strong>Port:</strong> ${process.env.SMTP_PORT || 'Not set'}</li>
                <li><strong>User:</strong> ${process.env.SMTP_USER || 'Not set'}</li>
                <li><strong>From:</strong> ${process.env.SMTP_FROM || 'Not set'}</li>
              </ul>
            </div>
            <p><em>Sent at: ${new Date().toLocaleString()}</em></p>
          </body>
        </html>
      `
    );
    
    console.log('\n📊 Email test result:');
    console.log(`Status: ${result.status === 1 ? '✅ Success' : '❌ Failed'}`);
    console.log(`Message: ${result.message}`);
    
    if (result.status === 1) {
      console.log('\n🎉 SMTP configuration is working correctly!');
      console.log('📧 Check your email inbox for the test message.');
      console.log('\n✅ You can now use the email functionality in your microservice.');
    } else {
      console.log('\n❌ SMTP configuration failed!');
      console.log('🔧 Please check your SMTP settings in the .env file.');
      console.log('📖 See SETUP_ENV.md for troubleshooting steps.');
    }
  } catch (error) {
    console.error('\n💥 SMTP test failed with error:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env file configuration');
    console.log('2. Verify SMTP credentials');
    console.log('3. Ensure internet connection');
    console.log('4. Check firewall settings');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  console.log('🚀 Starting SMTP Configuration Test...\n');
  testSMTP();
}

export { testSMTP }; 