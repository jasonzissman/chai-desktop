const MongoClient = require('mongodb').MongoClient;
const MongoObjectId = require('mongodb').ObjectId;
const logger = require('./helpers/log-helper');
const child_process = require('child_process');
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

function executeTask(task) {
  if (task && task.length > 0 && task.contains("crown") && task.contains("netflix")) {
    child_process.exec(process.argv[6].split("--crown=")[1], (error, stdout, stderr) => {
      logger.log(stdout);
    });
  } else if (task && task.length > 0 && task.contains("hulu") && task.contains("burgers")) {
    child_process.exec(process.argv[5].split("--bobs-burgers=")[1], (error, stdout, stderr) => {
      logger.log(stdout);
    });
  }
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

    if (tasks && tasks.length > 0) {
      logger.log(`Found ${tasks.length} relevant tasks. Processing...`);

      let allTasksIds = [];
      for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        allTasksIds.push(MongoObjectId(task._id));
        logger.log(`Executing task ${task.thingToOpen}.`);
        executeTask(task.thingToOpen);
      }

      logger.log(`Deleting tasks with ids in ${allTasksIds}.`);
      await dbClient.db("smartfeed").collection("smartfeedItems").deleteMany({
        _id: {
          $in: allTasksIds
        }
      });
      logger.log(`Successfully deleted tasks with ids ${allTasksIds}.`);
    }

    dbClient.close();

  }, checkInterval);
}

main();
