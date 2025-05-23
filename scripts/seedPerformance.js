require('dotenv').config();
const mongoose    = require('mongoose');
const Performance = require('../models/Performance');
const Group       = require('../models/Group');

async function seedPerformances() {
  try {
    // Connect
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing performances
    await Performance.deleteMany({});
    console.log('Cleared Performance collection');

    // Find groups to get their _ids
    const rush    = await Group.findOne({ name: 'Rush' }).lean();
    const primus    = await Group.findOne({ name: 'Primus' }).lean();
    const mrBig = await Group.findOne({ name: 'Mr. Big' }).lean();

    if (!rush || !primus || !mrBig) {
      throw new Error('One or more groups not found; run your group seed first.');
    }

    // Define performances
    const performances = [
      {
        group:       rush._id,
        date:        new Date('2025-06-10T20:00:00Z'),
        venue:       'Radio City Music Hall',
        ticketsSold: 82000,
        revenue:     82000 * 75
      },
      {
        group:       primus._id,
        date:        new Date('2025-07-15T19:30:00Z'),
        venue:       'Blue Note Jazz Club',
        ticketsSold: 300,
        revenue:     300 * 100
      },
      {
        group:       mrBig._id,
        date:        new Date('2025-08-20T18:00:00Z'),
        venue:       'Royal Albert Hall',
        ticketsSold: 5000,
        revenue:     5000 * 125
      }
    ];

    // Insert 
    await Performance.insertMany(performances);
    console.log(`Inserted ${performances.length} performances`);

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('SeedPerformance error:', err);
    process.exit(1);
  }
}

seedPerformances();
