const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
