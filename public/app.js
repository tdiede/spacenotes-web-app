// app dot jay ess

document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    // firebase.database().ref('map-tickets').once('value')
    //   .then(snapshot => {
    //     console.log("value is", snapshot.val());
    //   });
    webClient();

  } catch (e) {
    console.error(e);
  }
});


function webClient () {
  const $app = $('#app');

  firebase.database().ref('map-tickets').once('value')
    .then(snapshot => {
      let data = snapshot.val();

      for (let roomId in data) {
        renderRoomTable(roomId, data[roomId]);
      }

    });


  function renderRoomTable (roomId, tickets) {
    console.log("render room talbe with id", roomId);

    firebase.database().ref('maps').once('value')
      .then(snapshot => {
        let roomData = snapshot.val();

        if (roomData[roomId]) {
          console.log("room info: ", roomData[roomId]);
          let room = roomData[roomId];
          let $roomHeader = $(`<h2>${room.name}</h2>`);

          let $table = $('<table border></table>');
          let $theaders = $(`
  <thead>
    <tr>
      <th>TICKET ID</th>
      <th>TICKET STATUS</th>
      <th>CONTENT</th>
    </tr>
  </thead>
           `);

          $table.append($theaders);


          for (let ticketId in tickets) {
            let $ticket = renderTicket(tickets[ticketId]);
            $table.append($ticket);
          }

          $app.append($roomHeader);
          $app.append($table);
        }
      });
  }

  function renderTicket(ticket) {
    let html = `
<tr>
  <td>${ticket.id}</td>
  <td>${ticket.status}</td>
  <td>${ticket.content}</td>
</tr>
`;
    return $(html);
  }
}
