const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: "string",
        enum: {
            values: ["interested","ignored","accepted","rejected"],
            message: "{VALUE} is not a valid status"
        },
        required: true
    }
}, {timestamps: true})

connectionRequestSchema.index(
    {fromUserId: 1}, {toUserId:1}, {unique: true}
)

connectionRequestSchema.pre("save", function(){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;