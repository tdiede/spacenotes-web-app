const functions = require('firebase-functions');
const request = require('request-promise');


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// spacenotes
exports.spacenotes = functions.https.onRequest((request, response) => {
 response.send(
 	`Hello from Therese! Insert web interface here.
 	Display all our database on the web.`
 );
});


const WEBHOOK_URL = 'https://hooks.slack.com/services/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';

exports.writeWebhook = functions.database.ref('/maps/{mapId}').onWrite((event) => {
  return request({
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: '{"text":"Hello, World!"}',
    resolveWithFullResponse: true,
  }).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});


// return request.post(WEBHOOK_URL, { json: { text: `New map from Firebase!` }});
