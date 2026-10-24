const mongoose = require('mongoose');

const uri = 'mongodb+srv://infoautogreenai_db_user:NpZewP63JYTdlI0n@cluster0.itx117f.mongodb.net/autogreen?retryWrites=true&w=majority';

async function updateKits() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected.');

  const Guide = mongoose.models.Guide || mongoose.model('Guide', new mongoose.Schema({}, { strict: false }));

  // 1. Starter Kit
  await Guide.updateOne(
    { _id: '6adc8def486c185f0a88bdd2' },
    {
      $set: {
        title: 'AI Marketer Starter',
        slug: 'ai-marketer-starter-kit',
        dotColor: 'emerald',
        badge: 'LEARN AI',
        topBadge: '',
        description: 'Discover what AI can do for your daily marketing work.',
        shortDescription: 'Discover what AI can do for your daily marketing work.',
        price: 99,
        originalPrice: 299,
        highlights: [
          '200+ AI tools',
          '100+ prompts',
          'Claude Skills',
          'Beginner workflows',
          'Claude walkthroughs',
          'Notion Starter System',
          'n8n introduction',
          'AI Marketer Community'
        ],
        ctaText: 'Start with Starter →',
        popular: false,
        orderIndex: 1,
        category: 'AI Marketing Toolkits',
        isActive: true,
        isFeatured: true
      }
    }
  );
  console.log('Starter updated.');

  // 2. Pro Kit (previously Community)
  await Guide.updateOne(
    { _id: '6adc8def486c185f0a88bdd5' },
    {
      $set: {
        title: 'AI Marketer Pro',
        slug: 'ai-marketer-pro-kit',
        dotColor: 'amber',
        badge: 'EXECUTE WITH AI',
        topBadge: '',
        description: 'Turn AI tools into repeatable marketing workflows.',
        shortDescription: 'Turn AI tools into repeatable marketing workflows.',
        price: 599,
        originalPrice: 1499,
        highlights: [
          'Everything in Starter',
          'Advanced AI tools',
          'Advanced Claude Skills',
          'Marketing workflows',
          'n8n automation lab',
          '10–20 automation workflows',
          'Marketing OS',
          'AI reporting system',
          'AI audit system',
          'Advanced research workflows'
        ],
        ctaText: 'Go Pro →',
        popular: false,
        orderIndex: 2,
        category: 'AI Marketing Toolkits',
        isActive: true,
        isFeatured: true
      }
    }
  );
  console.log('Pro updated.');

  // 3. Expert Stack
  await Guide.updateOne(
    { _id: '6adc8def486c185f0a88bdd8' },
    {
      $set: {
        title: 'AI Marketer Expert',
        slug: 'ai-marketer-expert-stack',
        dotColor: 'rose',
        badge: 'BUILD WITH AI',
        topBadge: 'Most Powerful',
        description: 'Build your own AI marketing department.',
        shortDescription: 'Build your own AI marketing department.',
        price: 1299,
        originalPrice: 2999,
        highlights: [
          'Everything in Starter + Pro',
          'AI employee builder',
          'AI agents',
          'Advanced n8n',
          'AI Agency OS',
          'AI freelancer system',
          'AI marketing agency system',
          'Custom workflow builder',
          'Monetization systems',
          'Expert community'
        ],
        ctaText: 'Become an AI Operator →',
        popular: true,
        orderIndex: 3,
        category: 'AI Marketing Toolkits',
        isActive: true,
        isFeatured: true
      }
    }
  );
  console.log('Expert updated.');

  const updatedKits = await Guide.find({
    _id: { $in: ['6adc8def486c185f0a88bdd2', '6adc8def486c185f0a88bdd5', '6adc8def486c185f0a88bdd8'] }
  });

  console.log('SUCCESS: All 3 kits updated in MongoDB!');
  for (const k of updatedKits) {
    console.log(`- ${k.title}: ₹${k.price} | badge: ${k.badge} | topBadge: ${k.topBadge || 'none'} | features: ${k.highlights.length}`);
  }

  await mongoose.disconnect();
}

updateKits().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
