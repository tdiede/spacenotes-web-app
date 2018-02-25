const functions = require('firebase-functions');
const request = require('request-promise');
const jinja2 = require('jinja-js');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);









/*

WEB APP STUFF

*/
exports.spacenotes = functions.https.onRequest((request, response) => {
 response.send(
 	`Hello from Therese! Insert web interface here.
 	Display all our database on the web.`
 );
});





/*

SLACK WEBHOOK STUFF

*/

// const ticketDATA = '{ "content": "This is another ticket", "id": "-L69HbonAuix1GByuHNa", "x": 12.300000190734863, "y": 2.0999999046325684, "z": 32.400001525878906 }';

const CONFIG_PATH = 'T0ZF0PGNL/B9EENCT9B/Pauk6o55Q0sIBXopJXaXnHVp'

const WEBHOOK_URL = `https://hooks.slack.com/services/${CONFIG_PATH}`;

exports.writeMapWebhook = functions.database.ref('/maps/{mapId}').onWrite((event) => {
  let mapId = event.params.mapId;
  let timestamp = Date.now();
  let options = {
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: 'Here I am, coming from Firebase, inside a payload. Here is my map id: ' + mapId + ' !! Make sure I send only once. t=' + timestamp },
    resolveWithFullResponse: true,
  };
  return request(options).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});



const ticketWebhook = (event) => {
  let content = event.data.val().content;
  let x = event.data.val().x.toString();
  let y = event.data.val().y.toString();
  let z = event.data.val().z.toString();
  let ticketId = event.params.ticketId;
  let timestamp = Date.now();
  let options = {
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: 'x: ' + x + '\ny: ' + x + '\nz: ' + z + '\ncontent: ' + content + ' <<<< A new ticket [ticket id: ' + ticketId + '] was created in Firebase @ time=' + timestamp + '.' },
    resolveWithFullResponse: true,
  };
  return options;
};


exports.createTicket = functions.database.ref('/tickets/{ticketId}').onCreate((event) => {
  let options = ticketWebhook(event);
  return request(options).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    // return console.log(Object.keys(event.data.ref));
    return console.log('SUCCESS! Posted', event.data.ref.path);
  });
});


exports.updateTicket = functions.database.ref('/tickets/{ticketId}').onUpdate((event) => {
  let ticketId = event.params.ticketId;
  let timestamp = Date.now();
  let options = {
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: 'Ticket [ticket id: ' + ticketId + '] was updated in Firebase @ time=' + timestamp + '.' },
    resolveWithFullResponse: true,
  };
  return request(options).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});


exports.deleteTicket = functions.database.ref('/tickets/{ticketId}').onDelete((event) => {
  let ticketId = event.params.ticketId;
  let timestamp = Date.now();
  let options = {
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: 'Ticket [ticket id: ' + ticketId + '] was deleted @ time=' + timestamp + '.' },
    resolveWithFullResponse: true,
  };
  return request(options).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});
