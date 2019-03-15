var playerAttacks = {
  //x, y, attackImg, size scale, frames (speed of attack), attack template
  1:{
    auto:function(x, y, rotation, player){return new Attack(x, y,rotation, "playerOneBasicAttack", 1.3, 1, "melee1", player)}
  }
}

var attackData = {
  //20 ticks = 1 second
  //speed: movement (without rotations), moveLock: ticks that you can't do anything,
  //effects:{effectName:[efectLevel, startFrame, endFrame]}, they can only be applied once
  //effects inGame rn: damage
  "melee1":{
    speed:0,
    moveLock:7,
    effects:{"damage":[1,0,10]},
    properties:[],
    loop: false,
    cooldown:12,
  },
  "projectile1":{
    speed:8,
    moveLock:5,
    effects:{"damage":[1,0,-1]},
    properties:[],
    loop: false,
    cooldown:25,
  }
}

var sprites = {
  "playerOneBasicAttack":{
    xs:64,
    ys:64,
    frames:7
  },
  "playerTwoBasicAttack":{
    xs:64,
    ys:64,
    frames:8
  }
}
