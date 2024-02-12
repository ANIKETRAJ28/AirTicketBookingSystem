const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");

const { createChannel, publishMessage } = require("../utils/messageQueues");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

const sendMessageQueue = async(req, res) => {
    const channel = await createChannel();
    const data = {message: "Success"};
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
    return res.status(200).json({
        message: "Successfully published the event"
    });
}

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        res.status(StatusCodes.OK).json({
            message: "Sucessfully created the booking",
            data: response,
            success: true,
            err: {}
        });
    } catch (error) {
        res.status(error.statusCode).json({
            message: error.message,
            data: {},
            success: false,
            err: error.explaination
        });
    }
}

module.exports = {
    create,
    sendMessageQueue
}