const { Booking } = require("../models/index");
const { StatusCodes } = require("http-status-codes");
const { ValidationError, AppError } = require("../utils/error/index");

class BookingRepository {
    
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.errors == "SequelizeValidationError") {
                throw new ValidationError();
            }
            throw new AppError(
                "RepositoryError",
                "Cannot create Booking",
                "There was some issue in creating the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = BookingRepository;