const MongoClient = require('mongodb').MongoClient;
const logger = require('./helpers/log-helper');
logger.setLogFilenameAndPath(process.argv[4].split("--logFile=")[1])

// TODO - database manipulation cannot be done in local application. 
// Must be done in Azure function or otherwise online, otherwise
// any savy client can maliciously update anything in the database.

async function connectToDatabase(dbConnString) {

  return MongoClient.connect(dbConnString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => {
      cachedDbClient = db;
      return cachedDbClient;
    });
}

let checkInterval = 2000; // ms
const userId = process.argv[3].split("--userId=")[1];
const dbConnString = process.argv[2].split("--dbConnString=")[1];

async function main() {

  logger.log("Application starting");

  // 1. Monitor database at recurring interval
  setInterval(async () => {
    let dbClient = await connectToDatabase(dbConnString);
    let tasks = await dbClient.db("smartfeed").collection("smartfeedItems").find({
      userId: userId
    }).toArray();
    dbClient.close();

    if (tasks && tasks.length > 0) {
      logger.log(`Found ${tasks.length} relevant tasks. Processing...`);

      let allTasksIds = [];
      for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        allTasksIds.push(task._id);
        logger.log(`must execute task ${task.thingToOpen}.`);
      }

      logger.log(`must delete id ${allTasksIds}.`);
    }

  }, checkInterval);
}

main();
