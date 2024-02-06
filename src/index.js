const express = require("express");
const bodyParser = require("body-parser");
const { PORT, FLIGHT_SERVICE_PATH } = require("./config/serverConfig");
const apiRoutes = require("./routes/index");
const db = require("./models/index");

const app = express();
const setupAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use("/api", apiRoutes);

    app.listen(PORT, () => {

        console.log(`Server started at port ${PORT}`);

        if(process.env.DB_SYNC) {
            db.sequelize.sync({alter: true});
        }        
        console.log(FLIGHT_SERVICE_PATH);
    });
}

setupAndStartServer();