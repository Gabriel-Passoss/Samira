import { DataDragon, DataDragonConfig } from '../src/index';

async function dataDragonDirectExample() {
  // Initialize DataDragon with configuration
  const config: DataDragonConfig = {
    version: 'latest',
    language: 'en_US',
    includeFullUrl: true, // Return full URLs for assets
  };

  const dataDragon = new DataDragon(config);

  console.log('🚀 DataDragon initialized!');
  console.log('📦 DataDragon config:', dataDragon.getConfig());

  try {
    // Initialize the service (this fetches and caches all data)
    console.log('\n🔄 Initializing DataDragon service...');
    await dataDragon.init();
    console.log('✅ DataDragon service initialized successfully!');

    // Get the latest game version
    console.log('\n📋 Fetching latest game version...');
    const versionsResult = await dataDragon.getLatestVersion();

    if (versionsResult.isRight()) {
      const versions = versionsResult.value;
      console.log(`✅ Latest version: ${versions[0]}`);
      console.log(`📦 Available versions: ${versions.slice(0, 5).join(', ')}...`);
    } else {
      console.error('❌ Failed to get versions:', versionsResult.value.message);
      return;
    }

    // Get all champions
    console.log('\n⚔️  Fetching all champions...');
    const championsResult = await dataDragon.getChampions();

    if (championsResult.isRight()) {
      const champions = championsResult.value;
      const championNames = Object.keys(champions).slice(0, 10);
      console.log(`✅ Found ${Object.keys(champions).length} champions`);
      console.log(`📝 Sample champions: ${championNames.join(', ')}...`);

      // Get details for a specific champion by ID
      try {
        const aatrox = dataDragon.getChampionResumeById(266); // Aatrox ID
        console.log(`\n🗡️  Champion: ${aatrox.name} - ${aatrox.title}`);
        console.log(`🆔 Key: ${aatrox.key}`);
        console.log(`🖼️  Image: ${aatrox.image.full}`);
      } catch (error) {
        console.log('ℹ️  Champion not found in cache, this is expected before init()');
      }
    } else {
      console.error('❌ Failed to get champions:', championsResult.value.message);
    }

    // Get all items
    console.log('\n🛡️  Fetching all items...');
    const itemsResult = await dataDragon.getItems();

    if (itemsResult.isRight()) {
      const items = itemsResult.value;
      const itemNames = Object.values(items)
        .slice(0, 5)
        .map((item) => item.name);
      console.log(`✅ Found ${Object.keys(items).length} items`);
      console.log(`📝 Sample items: ${itemNames.join(', ')}...`);

      // Get details for a specific item by ID
      try {
        const boots = dataDragon.getItemById(1001); // Boots of Speed
        console.log(`\n👢 Item: ${boots.name}`);
        console.log(`💰 Cost: ${boots.gold.total} gold`);
        console.log(`🏷️  Tags: ${boots.tags.join(', ')}`);
        console.log(`🖼️  Image: ${boots.image.full}`);
      } catch (error) {
        console.log('ℹ️  Item not found in cache, this is expected before init()');
      }
    } else {
      console.error('❌ Failed to get items:', itemsResult.value.message);
    }

    // Get runes
    console.log('\n🔮 Fetching runes...');
    const runesResult = await dataDragon.getRunes();

    if (runesResult.isRight()) {
      const runes = runesResult.value;
      const runeNames = runes.slice(0, 5).map((rune) => rune.name);
      console.log(`✅ Found ${runes.length} rune trees`);
      console.log(`📝 Rune trees: ${runeNames.join(', ')}...`);

      // Get details for a specific rune tree by ID
      try {
        const precision = dataDragon.getRuneTreeById(8000); // Precision tree
        console.log(`\n🔮 Rune Tree: ${precision.name}`);
        console.log(`🆔 ID: ${precision.id}`);
        console.log(`🖼️  Icon: ${precision.icon}`);
      } catch (error) {
        console.log('ℹ️  Rune tree not found in cache, this is expected before init()');
      }
    } else {
      console.error('❌ Failed to get runes:', runesResult.value.message);
    }

    // Get summoner spells
    console.log('\n✨ Fetching summoner spells...');
    const spellsResult = await dataDragon.getSummonerSpells();

    if (spellsResult.isRight()) {
      const spells = spellsResult.value;
      const spellNames = Object.values(spells)
        .slice(0, 5)
        .map((spell) => spell.name);
      console.log(`✅ Found ${Object.keys(spells).length} summoner spells`);
      console.log(`📝 Sample spells: ${spellNames.join(', ')}...`);

      // Get details for a specific summoner spell by ID
      try {
        const flash = dataDragon.getSummonerSpellById(4); // Flash
        console.log(`\n✨ Summoner Spell: ${flash.name}`);
        console.log(`🆔 ID: ${flash.id}`);
        console.log(`🖼️  Image: ${flash.image.full}`);
      } catch (error) {
        console.log('ℹ️  Summoner spell not found in cache, this is expected before init()');
      }
    } else {
      console.error('❌ Failed to get summoner spells:', spellsResult.value.message);
    }

    // Demonstrate asset URL generation
    console.log('\n🖼️  Asset URL Examples:');

    // Champion images
    const championImage = dataDragon.getChampionImageUrl('Aatrox');
    const skinImage = dataDragon.getChampionImageUrl('Aatrox', '1');
    console.log(`🗡️  Champion image: ${championImage}`);
    console.log(`🎨  Skin image: ${skinImage}`);

    // Item images
    const itemImage = dataDragon.getItemImageUrl('1001');
    console.log(`🛡️  Item image: ${itemImage}`);

    // Profile icons
    const profileIcon = dataDragon.getProfileIconUrl(1);
    console.log(`👤 Profile icon: ${profileIcon}`);

    // Champion splash art
    const splashArt = dataDragon.getChampionSplashUrl('Aatrox');
    const skinSplash = dataDragon.getChampionSplashUrl('Aatrox', '1');
    console.log(`🎨  Splash art: ${splashArt}`);
    console.log(`🎨  Skin splash: ${skinSplash}`);

    // Champion loading screen
    const loadingScreen = dataDragon.getChampionLoadingUrl('Aatrox');
    console.log(`🖼️  Loading screen: ${loadingScreen}`);

    // Demonstrate configuration changes
    console.log('\n⚙️  Configuration Examples:');

    // Change to Portuguese and asset paths only
    dataDragon.updateConfig({
      language: 'pt_BR',
      includeFullUrl: false,
    });

    console.log('📝 Updated config:', dataDragon.getConfig());

    // Now asset URLs return paths instead of full URLs
    const championImagePath = dataDragon.getChampionImageUrl('Aatrox');
    console.log(`🖼️  Champion image path: ${championImagePath}`);

    // Restore original config
    dataDragon.updateConfig({
      language: 'en_US',
      includeFullUrl: true,
    });

    console.log('✅ Configuration restored');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  dataDragonDirectExample().catch(console.error);
}

export { dataDragonDirectExample };
