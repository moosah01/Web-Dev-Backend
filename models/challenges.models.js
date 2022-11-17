const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const challengesSchema = new Schema ({
    challengeDesc: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    },
    totalAccepted: {
        type: Number,
        default: 1
    },
    totalCompleted: {
        type: Number,
        default: 1
    },
    successRate: {
        type: Number,
        default: 1,
    },
    creatorID: {
        type: String,
        required: true,
    },
    trophieID: {
        type: String,
        required: true,
        unique: true,
    },
    difficulty: {
        type: String,
        required: true
    },
    acceptanceCriteria: {
        type: Object,
        properties: {
            minVotes: {
                type: Number,
                required: true
            },
            winPercent: {
                type: Number,
                required: true
            },
            timeLimit: {
                type: Number,
                required: true
            }
        }
    }
})

challengesSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject.id;
        delete returnedObject._id;        
        delete returnedObject.__v;
    },
});

challengesSchema.plugin(uniqueValidator, { messagse: "Follow Request already sent" });

const challenges = mongoose.model("challenges", challengesSchema);
module.exports = challenges;