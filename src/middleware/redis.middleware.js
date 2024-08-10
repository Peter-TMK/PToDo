const redis = require("redis");

const redisClient = redis.createClient();
redisClient.on("error", async (error) => {
  console.error("Redis Client Error", error);
  if (redisClient.isClosed) {
    await redisClient.connect();
  }
});

module.exports = redisClient;
