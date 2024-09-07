const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectToDB = require("./config/dbConfig");
const routes = require("./routes/index");
const config = require("./config");

app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

connectToDB()
  .then(() => {
    app.listen(config?.PORT, () => {
      console.log(`Server is running on port ${config?.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello, this is Server!");
});
