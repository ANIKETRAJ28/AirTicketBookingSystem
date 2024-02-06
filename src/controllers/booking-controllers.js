const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");

const bookingService = new BookingService();

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
    create
}