const MongoClient = require('mongodb').MongoClient;

const MongoHelper = {
        
    doesSmartFeedUserIdAlreadyExist: async (smartFeedUserIdToCheck) => {
        
        let dbClient = await MongoClient.connect(MongoHelper.uri);
        let smartFeedUserId = await dbClient.db("smartfeed").collection("smartfeedUserIds").find({
            userId: smartFeedUserIdToCheck
        }).toArray();
        dbClient.close();
        
        // TODO This should only ever return 1 item. Get rid of array logic.
        if (smartFeedUserId && smartFeedUserId.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    
    getSmartFeedUserId: async (alexaUserId) => {
        
        // TODO - see if we can cache smartFeedUserId "in memory". WHile this is all stateless, 
        // perhaps there is a non-permanent storage mechanism that could allow us to bypass mongo?
        
        let dbClient = await MongoClient.connect(MongoHelper.uri);
        let smartFeedUserId = await dbClient.db("smartfeed").collection("smartfeedUserIds").find({
            alexaUserId: alexaUserId
        }).toArray();
        dbClient.close();
        
        // TODO This should only ever return 1 item. Get rid of array logic.
        if (!smartFeedUserId || smartFeedUserId.length === 0) {
            return undefined;
        } else {
            return smartFeedUserId[0].userId;
        }
    },
    
    deleteSmartFeedId:  async (smartFeedUserId) => {
        let dbClient = await MongoClient.connect(MongoHelper.uri);
        await dbClient.db("smartfeed").collection("smartfeedUserIds").deleteMany({
            userId: smartFeedUserId
        });
        dbClient.close();
        return;
    },
    
    insertSmartFeedId: async (smartFeedUserId, alexaUserId) => {
        let dbClient = await MongoClient.connect(MongoHelper.uri);
        await dbClient.db("smartfeed").collection("smartfeedUserIds").insertOne({
            userId: smartFeedUserId,
            alexaUserId: alexaUserId
        });
        dbClient.close();
        return;        
    },
    
    insertSmartFeedItem: async(smartFeedUserId, thingToOpen) => {
        let dbClient = await MongoClient.connect(MongoHelper.uri);
        await dbClient.db("smartfeed").collection("smartfeedItems").insertOne({
            userId: smartFeedUserId,
            thingToOpen: thingToOpen,
            created: new Date().getTime()
        });
        dbClient.close();
        return;
    }
};
module.exports = MongoHelper;