import { Samira } from '../src/samira';

async function dataDragonExample() {
  // Initialize Samira with Data Dragon configuration
  const samira = new Samira({
    apiKey: process.env.RIOT_API_KEY || 'your-api-key-here',
    platform: 'na1',
    region: 'americas',
    dataDragon: {
      version: 'latest',
      language: 'en_US',
      includeFullUrl: true, // Return full URLs for assets
    },
  });

  console.log('🚀 Samira initialized with Data Dragon support!');
  console.log('📦 Data Dragon config:', samira.dataDragon.getConfig());

  try {
    // Get the latest game version
    console.log('\n📋 Fetching latest game version...');
    const versionsResult = await samira.dataDragon.getLatestVersion();

    if (versionsResult.isRight()) {
      const versions = versionsResult.value;
      console.log(`✅ Latest version: ${versions[0]}`);
      console.log(`📦 Available versions: ${versions.slice(0, 5).join(', ')}...`);

      // Update to use the latest version
      samira.dataDragon.updateConfig({ version: versions[0] });
    } else {
      console.error('❌ Failed to get versions:', versionsResult.value.message);
      return;
    }

    // Get all champions
    console.log('\n⚔️  Fetching all champions...');
    const championsResult = await samira.dataDragon.getChampions();

    if (championsResult.isRight()) {
      const champions = championsResult.value;
      const championNames = Object.keys(champions).slice(0, 10);
      console.log(`✅ Found ${Object.keys(champions).length} champions`);
      console.log(`📝 Sample champions: ${championNames.join(', ')}...`);

      // Get details for a specific champion
      const aatroxResult = await samira.dataDragon.getChampion('Aatrox');
      if (aatroxResult.isRight()) {
        const aatrox = aatroxResult.value;
        console.log(`\n🗡️  Champion: ${aatrox.name} - ${aatrox.title}`);
        console.log(`🆔 Key: ${aatrox.key}`);
        console.log(`🖼️  Image: ${aatrox.image.full}`);
        console.log(`🎨 Skins: ${aatrox.skins.length}`);
        console.log(`✨ Spells: ${aatrox.spells.length}`);
      }
    } else {
      console.error('❌ Failed to get champions:', championsResult.value.message);
    }

    // Get all items
    console.log('\n🛡️  Fetching all items...');
    const itemsResult = await samira.dataDragon.getItems();

    if (itemsResult.isRight()) {
      const items = itemsResult.value;
      const itemNames = Object.values(items)
        .slice(0, 5)
        .map((item) => item.name);
      console.log(`✅ Found ${Object.keys(items).length} items`);
      console.log(`📝 Sample items: ${itemNames.join(', ')}...`);

      // Get details for a specific item
      const bootsResult = await samira.dataDragon.getItem('1001'); // Boots of Speed
      if (bootsResult.isRight()) {
        const boots = bootsResult.value;
        console.log(`\n👢 Item: ${boots.name}`);
        console.log(`💰 Cost: ${boots.gold.total} gold`);
        console.log(`🏷️  Tags: ${boots.tags.join(', ')}`);
        console.log(`🖼️  Image: ${boots.image.full}`);
      }
    } else {
      console.error('❌ Failed to get items:', itemsResult.value.message);
    }

    // Get runes
    console.log('\n🔮 Fetching runes...');
    const runesResult = await samira.dataDragon.getRunes();

    if (runesResult.isRight()) {
      const runes = runesResult.value;
      const runeNames = runes.slice(0, 5).map((rune) => rune.name);
      console.log(`✅ Found ${runes.length} rune trees`);
      console.log(`📝 Rune trees: ${runeNames.join(', ')}...`);
    } else {
      console.error('❌ Failed to get runes:', runesResult.value.message);
    }

    // Get summoner spells
    console.log('\n✨ Fetching summoner spells...');
    const spellsResult = await samira.dataDragon.getSummonerSpells();

    if (spellsResult.isRight()) {
      const spells = spellsResult.value;
      const spellNames = Object.values(spells)
        .slice(0, 5)
        .map((spell) => spell.name);
      console.log(`✅ Found ${Object.keys(spells).length} summoner spells`);
      console.log(`📝 Sample spells: ${spellNames.join(', ')}...`);
    } else {
      console.error('❌ Failed to get summoner spells:', spellsResult.value.message);
    }

    // Demonstrate asset URL generation
    console.log('\n🖼️  Asset URL Examples:');

    // Champion images
    const championImage = samira.dataDragon.getChampionImageUrl('Aatrox');
    const skinImage = samira.dataDragon.getChampionImageUrl('Aatrox', '1');
    console.log(`🗡️  Champion image: ${championImage}`);
    console.log(`🎨  Skin image: ${skinImage}`);

    // Item images
    const itemImage = samira.dataDragon.getItemImageUrl('1001');
    console.log(`🛡️  Item image: ${itemImage}`);

    // Profile icons
    const profileIcon = samira.dataDragon.getProfileIconUrl(1);
    console.log(`👤 Profile icon: ${profileIcon}`);

    // Champion splash art
    const splashArt = samira.dataDragon.getChampionSplashUrl('Aatrox');
    const skinSplash = samira.dataDragon.getChampionSplashUrl('Aatrox', '1');
    console.log(`🎨  Splash art: ${splashArt}`);
    console.log(`🎨  Skin splash: ${skinSplash}`);

    // Champion loading screen
    const loadingScreen = samira.dataDragon.getChampionLoadingUrl('Aatrox');
    console.log(`🖼️  Loading screen: ${loadingScreen}`);

    // Demonstrate configuration changes
    console.log('\n⚙️  Configuration Examples:');

    // Change to Portuguese and asset paths only
    samira.dataDragon.updateConfig({
      language: 'pt_BR',
      includeFullUrl: false,
    });

    console.log('📝 Updated config:', samira.dataDragon.getConfig());

    // Now asset URLs return paths instead of full URLs
    const championImagePath = samira.dataDragon.getChampionImageUrl('Aatrox');
    console.log(`🖼️  Champion image path: ${championImagePath}`);

    // Restore original config
    samira.dataDragon.updateConfig({
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
  dataDragonExample().catch(console.error);
}

export { dataDragonExample };
