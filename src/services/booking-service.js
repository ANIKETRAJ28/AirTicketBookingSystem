const { BookingRepository } = require("../repository/index");
const axios = require("axios");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError } = require("../utils/error");

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            console.log(getFlightRequestUrl);
            const response = await axios.get(getFlightRequestUrl);
            const flightData = response.data.data;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError("Something went wrong in the booking process", "Insufficient seats available");
            }
            const FlightPrice = flightData.price;
            const totalCost = FlightPrice * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestUrl, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"})
            return finalBooking;
        } catch (error) {
            console.log("error is",error);
            if(error.name == "RepositoryError" || error.name == "ValidationError") {
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;