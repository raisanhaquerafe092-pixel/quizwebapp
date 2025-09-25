#!/usr/bin/env node
/**
 * Quick test script for PWA functionality
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing PWA Configuration...\n');

// Check if required files exist
const requiredFiles = [
  'public/manifest.json',
  'public/favicon.ico',
  'public/icon-192.svg',
  'public/icon-512.svg',
  'public/apple-touch-icon.svg'
];

console.log('📁 Checking required PWA files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
  }
});

console.log('\n📋 Checking manifest.json...');
try {
  const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
  console.log(`✅ Manifest name: ${manifest.name}`);
  console.log(`✅ Icons count: ${manifest.icons?.length || 0}`);
  console.log(`✅ Start URL: ${manifest.start_url}`);
  console.log(`✅ Display mode: ${manifest.display}`);
} catch (error) {
  console.log('❌ Error reading manifest.json:', error.message);
}

console.log('\n🚀 Starting development server...');
console.log('After the server starts:');
console.log('1. Open http://localhost:3000');
console.log('2. Open DevTools (F12)');
console.log('3. Check Console for "[PWA]" messages');
console.log('4. Check Application tab → Manifest');
console.log('5. Check Application tab → Service Workers');
console.log('6. Look for install prompt');
console.log('\n📱 PWA Test Checklist:');
console.log('□ No favicon conflicts');
console.log('□ Service Worker registered');
console.log('□ Manifest loads correctly');
console.log('□ Icons display properly');
console.log('□ Install prompt appears');

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('\n❌ Failed to start dev server. Run: npm install && npm run dev');
}