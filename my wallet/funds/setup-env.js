const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('Creating .env file from env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('.env file created successfully!');
} else {
  console.log('.env file already exists.');
} 