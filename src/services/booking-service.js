const { BookingRepository } = require("../repository/index");
const axios = require("axios");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError } = require("../utils/error");
const { createChannel, publishMessage } = require("../utils/messageQueues");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestUrl);
            const flightData = response.data.data;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError("Something went wrong in the booking process", "Insufficient seats available");
            }
            const FlightPrice = flightData.price;
            if(data.noOfSeats == undefined) data.noOfSeats = 1;
            const totalCost = FlightPrice * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestUrl, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
            this.sendMessageQueue(flightData);
            return finalBooking;
        } catch (error) {
            if(error.name == "RepositoryError" || error.name == "ValidationError") {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async sendMessageQueue(data) {
        const channel = await createChannel();
        const payload = {
            data: {
                subject: "Flight Notification",
                content: `Your flight with flight id ${data.id} named ${data.flightNumber} will arrive at ${data.arrivalTime}`,
                recepientEmail: "aniketraj28042003@gmail.com",
                notificationTime: " 2024-02-14 05:50:20"
            },
            service: "SEND_TICKET"
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    }
}

module.exports = BookingService;