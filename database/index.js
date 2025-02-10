const { MongoClient } = require('mongodb');

class Database {
  constructor(mongoURI) {
    this.mongoURI = mongoURI;
    this.client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async connect(onSuccess) {
    await this.client.connect();
    onSuccess();

    this.db = this.client.db('StudentsDB');
    this.studentsCollection = this.db.collection('Students');
    this.guildsCollection = this.db.collection('Guilds');
    this.statesCollection = this.db.collection('States');
    this.directoryCollection = this.db.collection('Directory');
  }

  async disconnect() {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  async getVerifiedCount() {
    return await this.studentsCollection.countDocuments();
  }
}

module.exports = Database;
