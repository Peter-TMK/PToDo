const app = require("./app");
require("dotenv/config");
// require("dotenv").config();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
