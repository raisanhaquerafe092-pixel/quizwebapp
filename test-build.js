#!/usr/bin/env node
/**
 * Test script to verify the Next.js build works correctly
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Testing Next.js Build...\n');

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n🔧 Running Next.js build...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n✅ Build successful! 🎉');
  console.log('\nYou can now run:');
  console.log('  npm run dev     - Start development server');
  console.log('  npm run start   - Start production server');
  console.log('\n📱 PWA Features:');
  console.log('  - Installable on mobile and desktop');
  console.log('  - Offline support');
  console.log('  - Responsive design');
  console.log('  - Service worker caching');
  
} catch (error) {
  console.error('\n❌ Build failed:');
  console.error(error.message);
  process.exit(1);
}