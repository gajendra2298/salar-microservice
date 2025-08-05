const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    console.log('📝 You can edit it to customize your configuration');
  } else {
    // Copy env.example to .env
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env file from env.example');
      console.log('📝 Please edit .env file with your configuration');
    } else {
      console.log('❌ env.example file not found');
      console.log('📝 Please create a .env file manually');
    }
  }
  
  console.log('\n🚀 To start the application:');
  console.log('   npm run start:dev');
  console.log('\n📖 Swagger UI will be available at:');
  console.log('   http://localhost:3001/api');
  
} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
  console.log('📝 Please create .env file manually');
} 