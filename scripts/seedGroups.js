require('dotenv').config();
const mongoose = require('mongoose');
const Group    = require('../models/Group');

async function seed() {
  // Connect
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing groups
  await Group.deleteMany({});
  console.log('🧹  Cleared Group collection');

  // Data
  const groups = [
    {
      name: 'Rush',
      members: ['Geddy', 'Alex', 'Neil'],
      genre: 'Prog Rock',
      costToPerform: 21120,
      originCity: 'Toronto',
      activeSince: new Date('1968-07-21'),
      website: 'https://rush.com',
      albumsReleased: 21
    },
    {
      name: 'Primus',
      members: ['Les', 'Tim', 'Larry'],
      genre: 'Prog Rock',
      costToPerform: 5000,
      originCity: 'San Francisco',
      activeSince: new Date('1984-09-10'),
      website: 'https://primus.com',
      albumsReleased: 12
    },
    {
      name: 'Mr. Big',
      members: ['Eric','Paul','Billy','Pat'],
      genre: 'Rock',
      costToPerform: 4000,
      originCity: 'Los Angeles',
      activeSince: new Date('1988-01-15'),
      website: 'https://mrbigsite.com',
      albumsReleased: 7
    }
  ];

  // Insert 
  await Group.insertMany(groups);
  console.log(`Inserted ${groups.length} groups`);

  // Disconnect
  await mongoose.disconnect();
  console.log('Disconnected');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
