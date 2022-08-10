const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const middlewareFunction = express.json();
app.use(middlewareFunction);

let db;

app.get('/books', async (req, res) => {
    let books = await db.books.find({}).toArray();
  res.send(books);
});

app.get('/books/:id', async (req, res) => {
  const book = await db.books.findOne({_id: ObjectId(req.params.id)});
  res.send(book);
});

app.post('/books', async (req, res) => {
  const newBook = {
    title: req.body.title || "No content",
    author: req.body.author || "No author"
  }
  db.books = await db.books.insertOne(newBook);
  res.send(newBook);
});

app.patch('/books/:id', async (req, res) => {
    db.books = await db.books.updateOne({_id: ObjectId(req.params.id)}, {$set: {"title": req.body.title, "author":req.body.author}})
    res.send(204);
});

app.delete('/books/:id', async (req, res) => {
    await db.books.deleteOne({_id: ObjectId(req.params.id)})
    res.send(204);
});

const { MongoClient, ObjectId } = require("mongodb");
// Connection URI
const uri = "mongodb+srv://Lelekann:Gbntrfynhjgrf1@cluster0.8dicynq.mongodb.net/?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
    await client.connect();
    console.log("Connected successfully to server");

    db = {
        books: client.db("library").collection("books")
    }

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })
}
run().catch(console.dir);
