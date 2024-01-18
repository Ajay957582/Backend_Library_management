import app from "./app.js";
import dbConnection from "./db.js";
import dotenv from "dotenv";

dotenv.config();

dbConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server started 🔥");
    });
  })
  .catch((error) => {
    console.log(error, "error from server file ");
  });
