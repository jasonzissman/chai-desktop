const MongoHelper = require('./mongo-helper');

const IdHelper = {
    
    idCharSet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
    
    generateNewSmartFeedId: (idLength) => {
        let newId = "";
        const charSetLength = IdHelper.idCharSet.length;
        
        for (let i = 0; i < idLength; i++ ) {
            newId += IdHelper.idCharSet.charAt(Math.floor(Math.random() * charSetLength));
        }
        
        return newId;
    },
    
    populateNewSmartFeedIdInDB: async (alexaUserId) => {
        const maxAttempts = 3;
        let attempts = 0;
        let newSmartFeedUserId = IdHelper.generateNewSmartFeedId(6);
        while (await MongoHelper.doesSmartFeedUserIdAlreadyExist(newSmartFeedUserId) && attempts < maxAttempts) {
            newSmartFeedUserId = IdHelper.generateNewSmartFeedId(6);
            attempts += 1;
        }
        if(attempts < maxAttempts) {
            await MongoHelper.insertSmartFeedId(newSmartFeedUserId, alexaUserId);
            return newSmartFeedUserId;
        } else {
            return undefined;
        }
    }

};
module.exports = IdHelper;