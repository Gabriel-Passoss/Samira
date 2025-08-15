import { createSamira, Samira, PLATFORMS, REGIONS, createPlatformSamira, createRegionalSamira } from '../src';

// Example: Basic usage of the Samira library
async function basicExample() {
  try {
    // Create a Samira instance (replace with your actual API key)
    const samira = createSamira('YOUR_RIOT_API_KEY_HERE');
    
    console.log('🚀 Samira League of Legends API Library initialized!');
    
    // Get current configuration
    const config = samira.getConfig();
    console.log('📋 Configuration:', config);
    
    // Get available platforms
    const platforms = Samira.getAvailablePlatforms();
    console.log('📱 Available platforms:', Object.keys(platforms).length);
    
    // Get available regions
    const regions = Samira.getAvailableRegions();
    console.log('🌍 Available regions:', Object.keys(regions).length);
    
    // Validate platform
    const isValidPlatform = Samira.isValidPlatform(PLATFORMS.NA1);
    console.log('✅ NA1 platform valid:', isValidPlatform);
    
    // Validate region
    const isValidRegion = Samira.isValidRegion(REGIONS.AMERICAS);
    console.log('✅ Americas region valid:', isValidRegion);
    
    // Get platform from region
    const platformFromRegion = Samira.getPlatformFromRegion(REGIONS.EUROPE);
    console.log('🇪🇺 Platform for Europe:', platformFromRegion);
    
    // Get region from platform
    const regionFromPlatform = Samira.getRegionFromPlatform(PLATFORMS.KR);
    console.log('🇰🇷 Region for KR platform:', regionFromPlatform);
    
    // Example of data validation (you would use this with actual API responses)
    console.log('\n🔍 Data validation methods available:');
    console.log('- Samira.validateChampion(data)');
    console.log('- Samira.validateSummoner(data)');
    console.log('- Samira.validateMatch(data)');
    console.log('- Samira.validateLeagueEntry(data)');
    console.log('- Samira.validateAccount(data)');
    console.log('- Samira.validateChampionMastery(data)');
    console.log('- Samira.validateCurrentGame(data)');
    
  } catch (error) {
    console.error('❌ Error occurred:', error);
  }
}

// Example: Working with different platforms and regions
async function platformExample() {
  try {
    console.log('\n🌍 Platform and Region Example:');
    
    // Create Samira for specific platform
    const naSamira = createSamira('YOUR_API_KEY', PLATFORMS.NA1);
    console.log('🇺🇸 NA Platform Samira created');
    
    // Create Samira for specific region
    const euSamira = createSamira('YOUR_API_KEY', undefined, REGIONS.EUROPE);
    console.log('🇪🇺 Europe Regional Samira created');
    
    // Create platform-specific Samira
    const krSamira = createPlatformSamira('YOUR_API_KEY', PLATFORMS.KR);
    console.log('🇰🇷 KR Platform Samira created');
    
    // Create regional Samira
    const seaSamira = createRegionalSamira('YOUR_API_KEY', REGIONS.SEA);
    console.log('🌏 SEA Regional Samira created');
    
  } catch (error) {
    console.error('❌ Platform error:', error);
  }
}

// Main function to run examples
async function runExamples() {
  console.log('🎮 Samira League of Legends API Library Examples\n');
  
  // Note: Replace 'YOUR_RIOT_API_KEY_HERE' with your actual Riot Games API key
  console.log('⚠️  IMPORTANT: Replace "YOUR_RIOT_API_KEY_HERE" with your actual API key before running!\n');
  
  await basicExample();
  await platformExample();
  
  console.log('\n🎉 Examples completed!');
}

// Export for use in other files
export {
  basicExample,
  platformExample,
  runExamples,
};

// Run examples if this file is executed directly
// Uncomment the line below to run examples automatically
// runExamples().catch(console.error);
