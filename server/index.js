const express = require("express")
const app = express()
const ItemModel = require('./models/Items')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(express.json())
app.use(cors());


mongoose.connect("mongodb+srv://ogg5015:Password123!@cluster0.qmq8oql.mongodb.net/proj2db?retryWrites=true&w=majority")



app.get("/getItems", async (req, res) => {
    try {
        const result = await ItemModel.find({});
        res.json(result);
    } catch (err) {
        res.json(err);
    }
});

app.post("/createItem", async (req, res) => {
    const item = req.body;
    const newItem = new ItemModel(item);
    await newItem.save();

    res.json(item);
});


  app.put('/update', async (req, res) => {
    const id = req.body._id;
    const update = {
      name: req.body.name,
      description: req.body.description,
      itemColor: req.body.itemColor,
      itemCondition: req.body.itemCondition,
      imageURL: req.body.imageURL,
    };
  
    try {
      const itemToUpdate = await ItemModel.findByIdAndUpdate(id, update, { new: true });
  
      if (!itemToUpdate) {
        return res.status(404).send("Item not found");
      }
  
      res.send("Updated");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating item");
    }
  });



app.delete("/deleteItem/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedItem = await ItemModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.send("Item deleted");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



app.listen(3007, () => {
    console.log("Server runs");
});