const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");

const { createChannel, publishMessage } = require("../utils/messageQueues");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

const sendMessageQueue = async(req, res) => {
    const channel = await createChannel();
    const payload = {
        data: {
            subject: "This is a noti from queue",
            content: "Some queue will subscribe this",
            recepientEmail: "aniketraj28042003@gmail.com",
            notificationTime: " 2024-02-14 05:50:20"
        },
        service: "CREATE_TICKET"
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
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