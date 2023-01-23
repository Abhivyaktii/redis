const express = require("express")
const axios = require("axios")
const cors = require("cors")
const redis = require("redis")

const redisClient = redis.createClient()
redisClient.connect();
const DEFAULT_EXPIRATION = 3600

const app = express()
app.use(cors())

app.get("/photos", async (req, res) => {

    try {
        const cacheResults = await redisClient.get("photos");
        if (cacheResults) {
            data = cacheResults
            res.json(data)
        }
        else {
            const { data } = await axios.get(
                "https://jsonplaceholder.typicode.com/photos"
            )
            await redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data))

            res.json(data)
        }
    } catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
    }
})


app.listen(3000)