const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const allowedOrigins = ["https://fnkpacheco.web.app", "https://grupomultiverso.net"];

exports.fetchUpdates = functions.https.onRequest((req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    cors({
      origin: true,
      optionsSuccessStatus: 204,
    })(req, res, async () => {
      const db = admin.firestore();
      const updatesList = [];

      try {
        const querySnapshot = await db.collection("updates").get();

        querySnapshot.forEach((doc) => {
          updatesList.push(doc.data());
        });

        res.json(updatesList);
      } catch (error) {
        console.error("Error fetching updates:", error);
        res.status(500).send("Failed to fetch updates.");
      }
    });
  } else {
    res.status(403).send("Unauthorized");
  }
});

