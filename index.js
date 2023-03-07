const mongoose = require("mongoose");
const express = require("express");
const ChannelModel = require("./models/channel");



const app = express();
const PORT = 3000;
const dbUrl = "mongodb+srv://laith:laith123@cluster0.ywsl9jp.mongodb.net/?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(dbUrl, connectionParams)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error", e);
  });

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

app.get("/insert", (req, res) => {
  const channel = new ChannelModel({
    name: "Jane",
    number: "12345",
    address: "12345, Dubai"
  });

  channel.save()
    .then(() => {
      res.status(200).send({ "msg": "Inserted to DB" });
    })
    .catch((err) => {
      console.error(err);
    });
});

  
  app.get("/read", (req,res)=>{
    ChannelModel.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({"msg":"Error occurred while fetching data"});
      });
  });
  
  app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { name, number, address } = req.body;
  
    ChannelModel.findByIdAndUpdate(
      id,
      { name, number, address },
      { new: true }
    )
      .then((updatedChannel) => {
        if (!updatedChannel) {
          res.status(404).send({ msg: "Channel not found" });
        } else {
          res.status(200).send({ msg: "Channel updated", data: updatedChannel });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ msg: "Error occurred while updating channel" });
      });
  });
  
  app.get("/delete", (req, res) => {
    ChannelModel.deleteOne({ name: "Jane" })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.status(404).send({ msg: "Channel not found" });
        }
        return res.status(200).send({ msg: "Channel deleted", data: result });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).send({ msg: "Error occurred while deleting channel" });
      });
  });
  
  