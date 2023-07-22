const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;

// MongoDB configuration
const mongoUsername = 'carsonaclay';
const mongoPassword = 'Rolltide92';
const mongoDatabase = 'MovieReviewApp';
const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@moviereviewapp.kgi9tq4.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the MongoDB database
const mongoClient = new MongoClient(mongoURI, mongoOptions);
mongoClient.connect((error) => {
  if (error) {
    console.error('Error connecting to MongoDB: ', error);
    return;
  }

  console.log('Connected to MongoDB');

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});

// API endpoint for storing reviews
app.post('/api/reviews', async (req, res) => {
  const { movieId, content, score } = req.body;

  try {
    const db = mongoClient.db();
    const reviewsCollection = db.collection('reviews');
    await reviewsCollection.insertOne({ movieId, content, score });
    console.log('Review stored in the database');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error storing review: ', error);
    res.sendStatus(500);
  }
});