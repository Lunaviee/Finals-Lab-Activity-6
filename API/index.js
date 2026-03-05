const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const CONNECTION_STRING = "mongodb://localhost:27017";
const DATABASENAME = "MyDb";
let database;

async function start() {
  try {
    const client = new MongoClient(CONNECTION_STRING);
    await client.connect();
    database = client.db(DATABASENAME);
    console.log("Connected to MongoDB");
    app.listen(5038, () => console.log("Server running on port 5038"));
  } catch (error) {
    console.error("Connection failed:", error);
  }
}
start();

// GET ALL BOOKS
app.get("/api/books/GetBooks", async (req, res) => {
  const result = await database.collection("Books").find({}).toArray();
  res.send(result);
});

// ADD BOOK (Includes Author & Year)
app.post("/api/books/AddBook", multer().none(), async (req, res) => {
  const numOfDocs = await database.collection("Books").countDocuments();
  await database.collection("Books").insertOne({
    id: String(numOfDocs + 1),
    title: req.body.title,
    desc: req.body.description,
    price: Number(req.body.price) || 0,
    author: req.body.author,
    year: req.body.year
  });
  res.json("Added Successfully");
});

// UPDATE BOOK (New Method)
app.put("/api/books/UpdateBook", multer().none(), async (req, res) => {
  await database.collection("Books").updateOne(
    { id: req.body.id },
    {
      $set: {
        title: req.body.title,
        desc: req.body.description,
        price: Number(req.body.price),
        author: req.body.author,
        year: req.body.year
      }
    }
  );
  res.json("Updated Successfully");
});

// DELETE BOOK
app.delete("/api/books/DeleteBook", async (req, res) => {
  await database.collection("Books").deleteOne({ id: req.query.id });
  res.json("Deleted successfully!");
});