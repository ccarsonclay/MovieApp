const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017'; 
const databaseName = 'MovieReviews'; 

app.use(express.json());

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  const db = client.db(databaseName);
  console.log('Connected to MongoDB');

  // api endpoints
  app.post('/reviews', (req, res) => {
    const { movieId, reviewText, rating } = req.body;
    const review = { movieId, reviewText, rating };

    db.collection('reviews')
      .insertOne(review)
      .then(() => {
        console.log('Review inserted successfully');
        res.status(201).json({ message: 'Review stored successfully' });
      })
      .catch((err) => {
        console.error('Error inserting review:', err);
        res.status(500).json({ error: 'An error occurred while saving the review' });
      });
  });

  // server start
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});