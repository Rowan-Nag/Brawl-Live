var playerAttacks = {
  //x, y, attackImg, size scale, attack template
  1:{
    auto:function(x, y, rotation){return new Attack(x, y, "playerOneBasicAttack", 1, "melee1")}
  }
}

var attackData = {
  //20 ticks = 1 second
  //speed: movement (without rotations), moveLock: ticks that you can't do anything,
  //effects:{effectName:[efectLevel, startFrame, endFrame]}, they can only be applied once
  //effects inGame rn: damage
  "melee1":{
    speed:0,
    moveLock:10,
    effects:{"damage":[1,0,10]},
    properties:[]
  },
  "projectile1":{
    speed:8,
    moveLock:5,
    effects:{"damage":[1,0,-1]},
    properties:[]
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
