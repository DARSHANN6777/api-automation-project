// global-teardown.ts
async function globalTeardown() {
  console.log('🧹 Cleaning up after tests...');
  console.log('✅ Global teardown completed');
}

export default globalTeardown;