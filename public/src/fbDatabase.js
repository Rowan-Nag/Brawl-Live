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
    "players": {},
    "nextPlayerId":0,
    "attacks":{
      "placeholder":"placeholder"
    },

  });

  joinServer(serverId);
}

function setServer(serverId){
  //set the server variable

  server = new Server(serverId)
  //console.log(server, 'setServer() - 1')

  let serverRef = firebase.database().ref('servers/'+serverId);

  serverRef.once("value", function(snapshot){


    //console.log(snapshot.val(), 2)
    server.setMap(snapshot.val()["map"]["mapId"])
    //console.log(snapshot)
/*
    if(typeof snapshot.val()["players"] !== 'undefined'){
      console.log("initializing players list")
      for(let i in snapshot.val()["players"]){
        let tempPlayer = new Player(1)
        server.players.push(tempPlayer)
        console.log("server.players")
        //snapshot.val()["players"][i]

      }
    }else{
      console.log("players doesn't exist")


    }*/
  });


  let playerRef = firebase.database().ref('servers/' + serverId + "/players")

  playerRef.on('child_changed', function(data){
    //console.log("changed", data.val()["playerName"])

    //use forEach() for this! ---important---
    let newPlayer = data.val()["playerName"];
    let changedPlayer = server.players[data.val()["playerName"].id];
    changedPlayer.x = newPlayer.x;
    changedPlayer.y = newPlayer.y;
    changedPlayer.image = newPlayer.image;
    changedPlayer.frameX = newPlayer.frameX;
    changedPlayer.cooldownEffects = newPlayer.cooldownEffects;
    changedPlayer.health = newPlayer.health;
    //console.log('CHANGED')
  });
  playerRef.on('child_removed', function(data){
    console.log('player removed')
    server.players.splice(data.val().id, 1)
    if(data.val().id < server.playerId){
      server.playerId -= 1
    }
    firebase.database().ref('servers/'+server.serverId).update({
      nextPlayerId: server.players.length
    })
  });
  playerRef.on('child_added', function(data){
    console.log('player added')
    let tempPlayer = new Player(1);
    server.players.push(tempPlayer)

    firebase.database().ref('servers/'+server.serverId).update({
      nextPlayerId: server.players.length
    })
  });




  let attackRef = firebase.database().ref('servers/'+serverId+"/attacks")

  attackRef.on('child_added', function(data){

    if(data.val() !== "placeholder"){
      d = data.val()["Attack"]
      game.attacks.push(playerAttacks[d.num][d.type](d.x, d.y, d.rotation, d.player,0, d.pKey))
      console.log(d.pKey, game.attacks[game.attacks.length-1].pKey)
    }
  });
}
function updatePlayer(){
  firebase.database().ref('servers/'+server.serverId+'/players/'+server.playerKey+'/playerName').update({

      x:server.players[server.playerId].x,
      y:server.players[server.playerId].y,
      image:server.players[server.playerId].image,
      frameX:server.players[server.playerId].frameX,
      cooldownEffects:server.players[server.playerId].cooldownEffects,
      health:server.players[server.playerId].health,
      id:server.playerId
  })
}

function joinServer(serverId){

  setServer(serverId);

  mid.innerHTML = "connected to: " + serverId
  //console.log(server, 'joinServer()')
  //let defName = "p"+server.players.length.toString()
  let tempPlayerID = -1
  firebase.database().ref('servers/'+serverId).once("value", function(snapshot){
    tempPlayerID = snapshot.val()["nextPlayerId"];
    server.playerId = tempPlayerID
  });
  server.playerKey = firebase.database().ref('servers/'+serverId+'/players').push({
      "playerName":new Player(1, server.players.length)
  }).key
  server.playerId = server.players.length-1
  firebase.database().ref('servers/'+serverId+'/players/'+server.playerKey+'/playerName').update({
    id:server.playerId
  })
  game.switchState(4)
}
function removeAttack(key){
  firebase.database().ref('servers/'+server.serverId+'/attacks/'+key).remove()

}
function sendAttack(player, type, rotation){

    let key1 = firebase.database().ref('servers/'+server.serverId+'/attacks').push({
      "Attack":{
        num:player.num,
        type:type,
        x:player.x+player.width/2,
        y:player.y+player.height/2,
        rotation:rotation,
        player:{
          x:player.x,
          y:player.y,
          width:player.width,
          height:player.height,

        },
        pKey:server.playerKey
      }
    }).key;

    return key1;
}
