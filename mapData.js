var MAPS = {
  1:{
    tiles:[
    [1,1,1,1,1,1,1,1,1,1],
    [1,13,8,8,8,8,8,8,14,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,10,15,15,15,15,15,15,9,1],
    [1,11,7,7,7,7,7,7,12,1]],
    adds:[
      [5,4,4,4,4,4,4,4,4,6],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2],
      [3,0,0,0,0,0,0,0,0,2]],
    collision:[
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]],




  }
}

var tileData = {
  0:{
    imgId:"floor",
    collision:0,
    name:"floor"
  },
  1:{
    imgId:"leftTreeWall",
    collision:0,
    name:"leftTreeWall"
  },
  2:{
    imgId:"rightTreeWall",
    collision:0,
    name:"rightTreeWall"
  },
  3:{
    imgId:"backRockWall",
    collision:0,
    name:"backRockWall"
  },
}

var playerData = {
   //just images for now
  images:{
    1:{
      down: "p1Down",
      up: "p1Up",
      left: "p1Left",
      right: "p1Right",
      attack: "playerOneBasicAttack"
    },
    2:{
      down: "p2Down",
      up: "p2Up",
      left: "p2Left",
      right: "p2Right",
      attack: "playerOneBasicAttack"
    }
  }
}

var attackData = {
  //10 ticks = 1 second
  //speed: movement (without rotations), moveLock: ticks that you can't do anything,
  //effects:{effectName:[efectLevel, startFrame, endFrame]}, they can only be applied once
  //effects inGame rn: damage
  "melee1":{
    speed:0,
    moveLock:10,
    effects:{damage:[1,0,10]},
    properties:[]
  },
  "projectile1":{
    speed:8,
    moveLock:5,
    effects:{damage:[1,0,-1]},
    properties:[]
  }
}

var sprites = {
  "PlayerOneBasicAttack":{
    xs:64,
    ys:64,
    frames:7
  },
  "PlayerTwoBasicAttack":{
    xs:64,
    ys:64,
    frames:8
  }
}
