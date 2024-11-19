const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-firebase-d700a-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// Fetch instances
app.get('/', (req, res) => {
  console.log("HTTP Get Request");
  const userReference = db.ref("/Users/");
  userReference.once("value")
    .then((snapshot) => {
      console.log(snapshot.val());
      res.json(snapshot.val());
    })
    .catch((error) => {
      console.log("The read failed: " + error.message);
      res.send("The read failed: " + error.message);
    });
});

// Create new instance
app.put('/', (req, res) => {
  console.log("HTTP Put Request");
  const { UserName, Name, Age } = req.body;

  const referencePath = `/Users/${UserName}/`;
  const userReference = db.ref(referencePath);
  userReference.set({ Name, Age })
    .then(() => {
      res.send("Data saved successfully.");
    })
    .catch((error) => {
      res.send("Data could not be saved. " + error.message);
    });
});

// Update existing instance
app.post('/', (req, res) => {
  console.log("HTTP POST Request");
  const { UserName, Name, Age } = req.body;

  const referencePath = `/Users/${UserName}/`;
  const userReference = db.ref(referencePath);
  userReference.update({ Name, Age })
    .then(() => {
      res.send("Data updated successfully.");
    })
    .catch((error) => {
      res.send("Data could not be updated. " + error.message);
    });
});

// Delete an instance
app.delete('/', (req, res) => {
  console.log("HTTP DELETE Request");
  const { UserName } = req.body;

  const referencePath = `/Users/${UserName}/`;
  const userReference = db.ref(referencePath);
  userReference.remove()
    .then(() => {
      res.send("Data deleted successfully.");
    })
    .catch((error) => {
      res.send("Data could not be deleted. " + error.message);
    });
});

const server = app.listen(8080, () => {
  console.log("App listening at http://localhost:8080");
});
