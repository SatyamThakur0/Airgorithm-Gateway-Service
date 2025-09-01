import express from "express";
import expressProxy from "express-http-proxy";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import nodeCron from "node-cron";
dotenv.config();
const PORT = process.env.PORT;

app.use(
    cors({
        origin: [
            `${process.env.AIRLINE_USER_PANEL_URL}`,
            `${process.env.AIRLINE_ADMIN_PANEL_URL}`,
        ],
        credentials: true,
    })
);

app.get("/", async (req, res) => {
    return res.json({
        ok: true,
        message: "Gateway service is running...",
    });
});

app.use(
    "/auth",
    expressProxy(`${process.env.AIRLINE_AUTH_SERVICE_URL}`, {
        proxyReqPathResolver: (req) => `/auth${req.url}`,
    })
);
app.use(
    "/flight",
    expressProxy(`${process.env.AIRLINE_FLIGHT_SERVICE_URL}`, {
        proxyReqPathResolver: (req) => `/flight${req.url}`,
    })
);
app.use(
    "/booking",
    expressProxy(`${process.env.AIRLINE_BOOKING_SERVICE_URL}`, {
        proxyReqPathResolver: (req) => `/booking${req.url}`,
    })
);

app.listen(PORT, () =>
    console.log(`Gateway service is running on PORT ${PORT}`)
);

// nodeCron.schedule("*/5 * * * * *", async () => {
//     let res = await fetch(`${process.env.SELF}`);
//     res = await res.json();
//     console.log(res.message, " : ", new Date().getSeconds());
// });
