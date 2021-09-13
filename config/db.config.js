const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/socialMediaDB", {
   useUnifiedTopology: true,
   useNewUrlParser: true,
});

const con = mongoose.connection;

con.on("open", () => {
   console.log("DB SuccessFully Connected...");
});
