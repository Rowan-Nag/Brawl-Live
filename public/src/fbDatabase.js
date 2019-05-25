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
    "players": {}


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
    console.log(snapshot.val()["players"])
    
    for(let i = 0; i < snapshot.val()["players"].length; i++){
      let tempPlayer = new Player(1)
      server.players.push(tempPlayer)
      console.log("server.players")
      //snapshot.val()["players"][i]
    }
  });
  var playerRef = firebase.database().ref('servers/' + serverId + "/players")

  playerRef.on('child_changed', function(data) {
    console.log("changed")
    //use forEach() for this! ---important---
    let newPlayer = data.val()["playerName"];
    let changedPlayer = server.players[data.val().id];
    changedPlayer.x = newPlayer.x;
    changedPlayer.y = newPlayer.y;
    changedPlayer.image = newPlayer.image;
    changedPlayer.frameX = newPlayer.frameX;
    changedPlayer.cooldownEffects = newPlayer.cooldownEffects;
    changedPlayer.health = newPlayer.health;
    console.log('CHANGED')
  });
  playerRef.on('child_removed', function(data){
    console.log('player removed')
    server.players.splice(data.val().id, 1)
  });
  playerRef.on('child_added', function(data){
    console.log('player added')
    tempPlayer = new Player(1);
    server.players.push(tempPlayer)
  })
 //console.log(server, 'setServer() - 2')

}
function updatePlayer(){
  firebase.database().ref('servers/'+server.serverId+'/players'+server.playerKey).update({
    "playerName":{
      x:server.players[server.playerId].x,
      y:server.players[server.playerId].y
    }
  })
}

function joinServer(serverId){
  
  setServer(serverId);
  mid.innerHTML = "connected to: " + serverId
  //console.log(server, 'joinServer()')
  //let defName = "p"+server.players.length.toString()
  
  server.playerKey = firebase.database().ref('servers/'+serverId+'/players').push({
      "playerName": new Player(1)
  }).key
  server.playerId = server.players.length-1
}
