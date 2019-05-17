var config = {
  apiKey: "AIzaSyBdfcvDs20C83am7k39wk6yK1VADvixnCc",
  authDomain: "brawl-live.firebaseapp.com",
  databaseURL: "https://brawl-live.firebaseio.com",
  projectId: "brawl-live",
  storageBucket: "brawl-live.appspot.com",
  messagingSenderId: "473229450954",
  appId: "1:473229450954:web:cfc6f24208493369"
};
firebase.initializeApp(config);
var server = null
// Get a reference to the database service
var database = firebase.database();

function createServer(serverId, mapId, player1) {
  firebase.database().ref('servers/' + serverId).set({
    "map": {
      "tiles" :MAPS[mapId].tiles,
      "mapAdds" :MAPS[mapId].adds,
      "mapCollision" :MAPS[mapId].collision,
    },

    "players": {
      "player1": player1
    },
    "playerCount":1,

  });

}
function setServer(serverId){
  //set the server variable
}
/*
  let serverRef = firebase.database().ref('server/' + serverId);
  sevrerRef.on('value', function(snapshot) {
    updateStarCount(postElement, snapshot.val());
  });
*/


/*
function joinServer(serverId){
  firebase.database().ref('servers/'+serverId+'/players').set{}
}*/
