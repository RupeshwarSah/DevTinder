const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();
const User = require("../models/user")

router.post('/request/send/:status/:toUserId', userAuth, async (req,res)=>{
    try {

        const fromUserId = req.user._id;

        const {status, toUserId} = req.params;

        const allowedStatus = ["interested", "ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                error: "Status can only be either interested or ignored"
            })
        }

        const isUserExist = await User.findById(toUserId);
        if(!isUserExist){
            return res.status(400).json({
                error: "the user doesn't exist"
            })
        }

        const isRepeatedConnection = await ConnectionRequest.findOne(
            {
                $or: [{fromUserId, toUserId}, {fromUserId: toUserId, toUserId: fromUserId}]
            }
        )

        if(isRepeatedConnection){
            return res.status(400).json({
                error: "Connection request already sent"
            })
        }

        const newConnection = new ConnectionRequest({fromUserId, toUserId, status});

        const data = await newConnection.save();
        res.status(200).json({
            message: "Connection request sent",
            data
        });
        
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        })
    }
})

router.post('/request/review/:status/:requestId', userAuth, async(req,res)=>{
    const loggedInUser = req.user
    const {status, requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json("invalid status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
    })

    if(!connectionRequest){
        return res.status(404).json({
            error: "Connection Request not found"
        })
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json({
        message: "Connection request "+status,
        data
    })

})

module.exports = router;