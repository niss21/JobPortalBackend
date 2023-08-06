const mongoose = require("mongoose");
mongoose.set('strictQuery', true);


mongoose.connect(`${process.env.DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));