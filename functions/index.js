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
 response.send();
});





/*

SLACK WEBHOOK STUFF

*/

// const ticketDATA = '{ "content": "This is another ticket", "id": "-L69HbonAuix1GByuHNa", "x": 12.300000190734863, "y": 2.0999999046325684, "z": 32.400001525878906 }';

const CONFIG_PATH = 'T0ZF0PGNL/B9EENCT9B/Pauk6o55Q0sIBXopJXaXnHVp'
const WEBHOOK_URL = `https://hooks.slack.com/services/${CONFIG_PATH}`;


const assembleMapMessage = (event) => {
  let mapId = event.params.mapId;
  let timestamp = Date.now();
  let message = '';

  let name;

  if (event.data.previous.exists() && event.data.exists()) {  // it's an UPDATE if both data and previous exist.
    name = event.data.val().name;
	let prevName = event.data.previous.val().name;

    message = 'Place `' + prevName + '` was changed to `' + name + '` [map id: ' + mapId + '] @ time=' + timestamp + '.';

  } else if (event.data.exists()) {  // it's a CREATE if only data exists.
    name = event.data.val().name;

    message = 'A new place [map id: ' + mapId + '] was created in `spacenotes` :smile: @ time=' + timestamp + '!';

  } else if (event.data.previous.exists()) {  // it's a DELETE if only previous exists.
  	message = 'Place ' + name + ' [map id: ' + mapId + '] was deleted @ time=' + timestamp + '.';
  }

  return message;
};


const assembleTicketMessage = (event) => {
  let ticketId = event.params.ticketId;
  let timestamp = Date.now();
  let message = '';

  let x;
  let y;
  let z;
  let content;

  if (event.data.previous.exists() && event.data.exists()) {  // it's an UPDATE if both data and previous exist.
    content = event.data.val().content;
	let prevContent = event.data.previous.val().content;

    message = '```' + prevContent + ' was changed to ' + content + ' <<<<<< Ticket [ticket id: ' + ticketId + '] was updated in Firebase @ time=' + timestamp + '.```';
  } else if (event.data.exists()) {  // it's a CREATE if only data exists.
    content = event.data.val().content;
    x = event.data.val().x.toString();
    y = event.data.val().y.toString();
    z = event.data.val().z.toString();

    message = 'x: ' + x + '\ny: ' + x + '\nz: ' + z + '\ncontent: ' + content + ' <<<< A new ticket [ticket id: ' + ticketId + '] was created in Firebase :smile: @ time=' + timestamp + '. Contact <@josh> [Josh] to fix this problem.';

  } else if (event.data.previous.exists()) {  // it's a DELETE if only previous exists.
  	message = '```Ticket [ticket id: ' + ticketId + '] was deleted @ time=' + timestamp + '.```';
  }

  return message;
};


// MAPS
exports.mapWebhook = functions.database.ref('/maps/{mapId}').onWrite((event) => {
  let message = assembleMapMessage(event);
  let options = {
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: message,
            mrkdwn: true },
    resolveWithFullResponse: true,
  };
  return request(options).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});


// TICKETS
exports.ticketWebhook = functions.database.ref('/tickets/{ticketId}').onWrite((event) => {
  let message = assembleTicketMessage(event);
  let options = {
    uri: WEBHOOK_URL,
    method: 'POST',
    json: true,
    body: { text: message,
            mrkdwn: true },
    resolveWithFullResponse: true,
  };
  return request(options).then((response) => {
    if (response.statusCode >= 400) {
      throw new Error(`HTTP Error, customized: ${response.statusCode}`);
    }
    return console.log('SUCCESS! Posted', event.data.ref);
  });
});

