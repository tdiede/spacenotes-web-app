const functions = require('firebase-functions');
const request = require('request');


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});



const WEBHOOK_URL = 'https://hooks.slack.com/services/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';

// Reads the content of the node that triggered the function and sends it to the registered Webhook
// URL.
exports.webhook = functions.database.ref('/hooks/{hookId}').onWrite((event) => {
  return request({
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: event.data.val(),
    resolveWithFullResponse: true,
  }).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});
