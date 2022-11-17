const mongoose = require("mongoose");
const {Schema} = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const mychallengesSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    challengesAccepted: [{
        type: String
    }]
})

mychallengesSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject.id;
        delete returnedObject._id;        
    },
});

mychallengesSchema.plugin(uniqueValidator, {message: "userName already has document created"});

const mychallenges = mongoose.model("mychallenges", mychallengesSchema);
module.exports = mychallenges;
