var playerAttacks = {
  //x, y, attackImg, size scale, frames (speed of attack), attack template
  1:{
    auto:function(x, y, rotation, player, k){return new Attack(x, y,rotation, "playerOneBasicAttack", 1.3, 1, "melee1", player, k)},
    roll:function(player){return new Movement(2, 3, 14, 120, player)}

  },
  2:{
    auto:function(x, y, rotation, player, k){return new Attack(x, y,rotation, "playerTwoBasicAttack", 1.3, 1, "melee1", player, k)},
    roll:function(player){return new Movement(8, 6, 17, 100, player)}

  },

}

var attackData = {
  //20 ticks = 1 second
  //speed: movement (without rotations), moveLock: ticks that you can't do anything,
  //effects:{effectName:[efectLevel, startFrame, endFrame]}, they can only be applied once
  //effects inGame rn: damage
  "melee1":{
    speed:0,
    moveLock:7,// 7
    hits:100,
    effects:[["damage",[0,10]]],
    properties:[],
    loop: false,
    cooldown:12, //12

  },
  "projectile1":{
    speed:8,
    moveLock:5,
    hits:2,
    effects:[["damage",[0,3]]],
    properties:[],
    loop: false,
    cooldown:25,

  }
}

var sprites = {
  "playerOneBasicAttack":{
    xs:64,
    ys:64,

    hBoxX:10,
    hBoxY:5,
    hBoxX2:45,
    hBoxY2:55,
    frames:7
  },
  "playerTwoBasicAttack":{
    xs:64,
    ys:64,

    hBoxX:5,
    hBoxY:40,
    hBoxX2:60,
    hBoxY2:64,
    frames:8
  }
}

var playerEffects = {
  allEffects: function(){return {
  walking:true,
  "moveLock":0,
  "autoCooldown":0,
  "rolling":0,
}
}}
var effectDict = {
  "damage": function(data, player){
    player.health -= data[1]
    console.log(player, player.health)
  }
}
