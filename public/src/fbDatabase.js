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
var server;


function createServer(serverId, mapId) {
  firebase.database().ref('servers/' + serverId).set({
    "map": {
      "mapId": mapId,
      "tiles" :MAPS[mapId].tiles,
      "mapAdds" :MAPS[mapId].adds,
      "mapCollision" :MAPS[mapId].collision,
    },
    "serverId": serverId,
    "players": {
      "placeholder": "placeholder"
    }


  });

  joinServer(serverId);
}

function setServer(serverId){
  //set the server variable

  server = new Server(serverId)
  //console.log(server, 'setServer() - 1')

  let serverRef = firebase.database().ref('servers/'+serverId);

  //console.log(serverRef, 1)
  serverRef.once("value", function(snapshot){


    //console.log(snapshot.val(), 2)
    server.setMap(snapshot.val()["map"]["mapId"])
    //console.log(snapshot)
    for(let i = 0; i < snapshot.val()["players"].length; i++){
      server.players.push(snapshot.val()["players"][i])
    }
  });
  var playerRef = firebase.database().ref('servers/' + serverId + "/players")

  playerRef.on('child_changed', function(data) {
    let newPlayer = data.val();
    let changedPlayer = server.players[data.val().id];
    changedPlayer.x = newPlayer.x;
    changedPlayer.y = newPlayer.y;
    changedPlayer.image = newPlayer.image;
    changedPlayer.frameX = newPlayer.frameX;
    changedPlayer.cooldownEffects = newPlayer.cooldownEffects;
    changedPlayer.health = newPlayer.health;
  });
  playerRef.on('child_removed', function(data){
    server.players.splice(data.val().id, 1)
  });
  playerRef.on('child_added', function(data){
    server.players.push(data.val())
  })
 //console.log(server, 'setServer() - 2')

}
function updatePlayer(){

}

function joinServer(serverId){
  setServer(serverId);
  //console.log(server, 'joinServer()')
  let name = "p"+server.players.length
  firebase.database().ref('servers/'+serverId+'/players').set({
    name:game.player1
  })
}
