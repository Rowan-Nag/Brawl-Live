var playerAttacks = {
  //x, y, attackImg, size scale, frames (speed of attack), attack template
  1:{
    auto:function(x, y, rotation, player, k, pKey){return new Attack(x, y,rotation, "playerOneBasicAttack", 1.3, 1, "melee1", player, k, pKey);console.log(pKey)},
    roll:function(player){return new Movement(2, 3, 14, 120, player)}

  },
  2:{
    auto:function(x, y, rotation, player, k, pKey){return new Attack(x, y,rotation, "playerTwoBasicAttack", 1.3, 1, "melee1", player, k, pKey)},
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


class Attack{
  constructor(x, y, rotation, image, size, frames, type, player, fbKey, pKey){
    this.x = x;//X/Y starting pos
    this.y = y;
    this.size = size; //size scale
    this.rotation = rotation; //rotation in radians
    this.frames = frames; //frames the attack lasts
    this.type = type //type (check attackData in mapData.js)
    this.hitstun = attackData[type].hitstun; //frames that the target can't be hit for after.
    this.speed = attackData[type].speed; //speed
    this.moveLock = attackData[type].moveLock //frames you can't move
    this.effects = attackData[type].effects; //effects
    this.properties = attackData[type].properties //other properties
    this.cooldown = attackData[type].cooldown // cooldown of attack
    this.frameX = 64 //sprites[image].xs; width/height of each frame
    this.frameY = 64 //sprites[image].ys;
    this.sx = (sprites[image].hBoxX)*size;
    this.sy = (sprites[image].hBoxY-this.frameY/2)*size;
    this.sx2 = (sprites[image].hBoxX2)*size;
    this.sy2 = (sprites[image].hBoxY2-this.frameY/2)*size;
    this.currentFrame = 0; //current frame of animation
    this.image = image
    this.totalFrames = sprites[image].frames; //total frames of the animation
    this.pKey = pKey;
    this.fbKey = fbKey; //key for FB database

    this.loop = false;//sprites[image].loop;
    this.ticksPerFrame = this.frames/this.totalFrames;
    this.player = player
    this.hitPlayers = [];
    this.playerId = player.id
    this.tr = {x:this.x+this.sx2,y:this.y+this.sy}
    this.tl = {x:this.x+this.sx,y:this.y+this.sy}
    this.bl = {x:this.x+this.sx,y:this.y+this.sy2}
    this.br = {x:this.x+this.sx2,y:this.y+this.sy2}

    this.tr = rotateCorner(this.player.x+this.player.width/2, this.player.y+this.player.height/2,this.tr, this.rotation)
    this.tl = rotateCorner(this.player.x+this.player.width/2, this.player.y+this.player.height/2,this.tl, this.rotation)
    this.bl = rotateCorner(this.player.x+this.player.width/2, this.player.y+this.player.height/2,this.bl, this.rotation)
    this.br = rotateCorner(this.player.x+this.player.width/2, this.player.y+this.player.height/2,this.br, this.rotation)

  }

  move(){
    if(this.speed > 0){
      let dx = this.speed*Math.cos(this.rotation);
      let dy = this.speed*Math.sin(this.rotation);
      moveCorners(this.tr, this.tl, this.bl, this.br, dx, dy)
      this.x += dx
      this.y += dy

    }
  }
  draw(x, y){

    ctx.save();

    ctx.translate(x, y)
    ctx.rotate(this.rotation)
    ctx.translate(-x,-y)
    ctx.drawImage(document.getElementById(this.image), this.frameX*this.currentFrame, 0, this.frameX, this.frameY, x-this.size*this.frameX/2,y-this.size*this.frameY, this.frameX*this.size, this.frameY*this.size)
    ctx.beginPath();
    if(boxes){
    ctx.strokeRect(x-this.size*this.frameX/2,y-this.frameY*this.size,this.frameX*this.size,this.frameY*this.size)
    ctx.stroke();
  }
    ctx.restore();
    ctx.save();
    if(boxes){
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(this.tr.x, this.tr.y);
    ctx.lineTo(this.tl.x, this.tl.y);
    ctx.lineTo(this.bl.x, this.bl.y);
    ctx.lineTo(this.br.x, this.br.y);
    ctx.lineTo(this.tr.x, this.tr.y);
    ctx.stroke();
    ctx.restore();
  }
  }
  incrementFrame(){
    this.currentFrame += 1;
    if(this.currentFrame > this.totalFrames){
      if(this.loop){
        this.currentFrame = 0;
      }else{
        this.currentFrame -=1
      }
    }
  }
}

class Movement{
  constructor(startLag, endLag, frames, distance,  player){
    this.player = player;

    this.startLag = startLag;
    this.endLag = endLag;
    this.frames = frames;
    this.distance = distance;
    this.angle = -this.player.mouseAngle({})-Math.PI/2
    this.frame = 0;
    this.moveFrames = frames-endLag-startLag
    console.log(this.moveFrames)
  }
  draw(){
    console.log(1)
    if(this.frame < this.startLag){
      console.log(2)
      ctx.save();
      ctx.strokeStyle = "#41dbdb";
      ctx.lineWidth = 7
      ctx.beginPath();
      ctx.arc(this.player.x+this.player.width/2, this.player.y+this.player.height/2, 25*(this.startLag-this.frame)/this.startLag, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore()
    }
    else if(this.frame > this.startLag + this.moveFrames){
      console.log(3)
      ctx.save();
      ctx.strokeStyle = "#FFaadb";
      ctx.lineWidth = 5
      ctx.beginPath();
      ctx.arc(this.player.x+this.player.width/2, this.player.y+this.player.height/2, 20*this.endLag/(this.frames-this.frame)/this.endLag, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore()
    }
  }
  move(){
    //console.log(this.frame, this.frame > this.startLag, this.frame < tthis.endLag)
    if(this.frame == this.startLag && this.player.cooldownEffects["invulnerability"] < this.moveFrames){
      this.player.cooldownEffects["invulnerability"] = this.moveFrames
    }
    if(this.frame > this.startLag && this.frame < this.frames-this.endLag){

      this.player.moveX(Math.cos(this.angle)*this.distance/this.moveFrames)

      this.player.moveY(Math.sin(this.angle)*this.distance/this.moveFrames)
    }
    else{

    }
    this.frame++
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
