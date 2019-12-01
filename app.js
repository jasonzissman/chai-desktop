const MongoClient = require('mongodb').MongoClient;
let cachedDbClient = undefined;

// TODO - database manipulation cannot be done in local application. 
// Must be done in Azure function or otherwise online, otherwise
// any savy client can maliciously update anything in the database.

async function connectToDatabase(dbConnString) {

  if (cachedDbClient) {
    return Promise.resolve(cachedDbClient);
  }

  return MongoClient.connect(dbConnString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => {
      cachedDbClient = db;
      return cachedDbClient;
    });
}


async function main() {
  const userId = process.argv[2].split("--userId=")[1];
  const dbConnString = process.argv[2].split("--dbConnString=")[1];
  let dbClient = await connectToDatabase(dbConnString);
  let tasks = await dbClient.db("smartfeed").collection("smartfeedItems").find({
    userId: userId
  }).toArray();
  console.log(tasks);
  dbClient.close();
}

main();
