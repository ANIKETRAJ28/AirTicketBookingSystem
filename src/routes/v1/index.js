const express = require("express");
const router = express.Router();
const { BookingControllers } = require("../../controllers/index");

router.post("/bookings", BookingControllers.create);
router.post("/publishing", BookingControllers.sendMessageQueue);

module.exports = router;