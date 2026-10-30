const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { validatePagination } = require("../utils/validation");

const router = express.Router();

const USER_SAFE_FIELDS = "firstName lastName age gender";

// GET RECEIVED CONNECTION REQUESTS
router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requestReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE_FIELDS)
      .sort({ createdAt: -1 });

    const data = requestReceived
      .filter((request) => request.fromUserId)
      .map((request) => {
        return {
          requestId: request._id,
          fromUserId: request.fromUserId,
          status: request.status,
          createdAt: request.createdAt,
        };
      });

    return res.status(200).json({
      message: `${data.length} connection requests received`,
      requests: data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET ACCEPTED CONNECTIONS
router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userConnection = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", USER_SAFE_FIELDS)
      .populate("toUserId", USER_SAFE_FIELDS);

    const data = userConnection
      .filter((connection) => connection.fromUserId && connection.toUserId)
      .map((connection) => {
        if (connection.fromUserId._id.equals(loggedInUser._id)) {
          return connection.toUserId;
        }

        return connection.fromUserId;
      });

    return res.status(200).json({
      message: `${data.length} connections`,
      connections: data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = Number(req.query.page ?? 1);
    const requestedLimit = Number(req.query.limit ?? 10);

    validatePagination(page, requestedLimit);

    const limit = Math.min(requestedLimit, 50);

    const skip = (page - 1) * limit;

    const relatedConnection = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    // console.log(relatedConnection);

    const relatedUserId = relatedConnection.map((relatedUser) => {
      if (relatedUser.fromUserId.equals(loggedInUser._id)) {
        return relatedUser.toUserId;
      }
      return relatedUser.fromUserId;
    });

    const excludedUserIds = [...relatedUserId, loggedInUser._id];

    // console.log(relatedUserId);

    const feedUser = await User.find({
      _id: { $nin: excludedUserIds },
    })
      .select("firstName lastName age gender")
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Users",
      data: feedUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
