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
  if (!task || task.length < 1) {
    return;
  }
  task = task.toLowerCase().trim();

  if (task.indexOf("open") > -1) {

    if (task.indexOf("crown") > -1 && task.indexOf("netflix") > -1) {
      child_process.exec(process.argv[6].split("--crown=")[1], (error, stdout, stderr) => {
        logger.log(stdout);
      });
    } else if (task.indexOf("hulu") > -1 && task.indexOf("burgers") > -1) {
      child_process.exec(process.argv[6].split("--bobs-burgers=")[1], (error, stdout, stderr) => {
        logger.log(stdout);
      });
    } else if (task.indexOf("chrome") > -1) {
      child_process.exec(process.argv[8].split("--chrome-start=")[1], (error, stdout, stderr) => {
        logger.log(stdout);
      });
    } 

  } else if (task.indexOf("close") > -1) {

    if (task.indexOf("chrome") > -1) {
      child_process.exec(process.argv[7].split("--chrome-stop=")[1], (error, stdout, stderr) => {
        logger.log(stdout);
      });
    }

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
        task["executedAt"] = new Date().getTime();
      }

      logger.log(`Inserting tasks with ids in ${allTasksIds} into archive.`);
      await dbClient.db("smartfeed").collection("smartfeedItemsArchive").insertMany(tasks);
      logger.log(`Successfully inserted tasks with ids ${allTasksIds} into archive.`);

      logger.log(`Deleting tasks with ids in ${allTasksIds} from active items.`);
      await dbClient.db("smartfeed").collection("smartfeedItems").deleteMany({
        _id: {
          $in: allTasksIds
        }
      });
      logger.log(`Successfully deleted tasks with ids ${allTasksIds} from active items.`);
    }

    dbClient.close();

  }, checkInterval);
}

main();
