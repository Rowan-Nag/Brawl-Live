var canvas = document.getElementById('base');
ctx = canvas.getContext('2d');
WIDTH = canvas.width;
HEIGHT = canvas.height;
ctx.fillRect(0,0,WIDTH,HEIGHT)

ctx.imageSmoothingEnabled = false;
var keys = {down: 40,
            up: 38,
            left: 37,
            right: 39,
            jump: 32,
            a:65,
            s:83,
            d:68,
            q: 81,
            w: 87,
            e: 69,
            r: 82,
            space:32,
            shift:16},
    keysDown = {},
    frameRate = 1/60,
    frameDelay = frameRate*1000,
    totalMenuButtons = 0,
    boxes = false,
    ticks = 0


console.log(1)
window.addEventListener('mousemove', initiatePos, false);

function initiatePos(e) {
      var pos = getMousePos(canvas, e);
  }

function getMousePos(canvas, evt){
  	var rect = canvas.getBoundingClientRect();

    mouseX = ((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width)
    mouseY = ((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)


}


addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

var requestInterval = function (fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback,  frameDelay);
    };
  })(),
      start = new Date().getTime(),
      handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
        delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};

var mid = document.getElementById('middleP')

var peer = new Peer;
var peerId, mainConn, connections = [], hosting = false, connPosition = -2;


peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  peerId = id
});


peer.on('connection', function(conn){
  console.log('connected to ', conn.id)
  if(hosting){
    console.log('hosting ', conn.id)
  }
  else if(!hosting){
    console.log('hosted by ', conn.id)

    }
  conn.on('data', function(data){
    //console.log('recieved ', data, ' from ', conn.id)
    switch(data[0]){
    case 0:

		mid.innerHTML=data[1].toString();

		break;

    case 1:
      mainConn=connectToId(data[1])
      mid.innerHTML = "Both Players Have Been Connected!"
      break;

    case 2:
      mainConn.send([4, game.player1.num])
      startGame()
      break;

    case 3:
      game.p2Keys = data[1]
      break;
    case 4:
      this.player2 = new Player(data[1])
      break;
    case 5:
      game.player2.x = data[1][0];
      game.player2.y = data[1][1];
      game.player2.image = data[1][2];
      game.player2.health = data[1][5];
      game.player2.cooldownEffects = data[1][4];

      game.player1.x = data[2][0];
      game.player1.y = data[2][1];
      game.player1.image = data[2][2];
      game.player1.health = data[2][5]
      game.player1.cooldownEffects = data[2][4];
      break;
    case 6:
      game.attacks.push(new Attack(data[1],data[2],data[3],data[4],data[5],data[6],data[7],game.player1))
      console.log(game.attacks[0])
  }
  })
});

function startGame(){

  if(hosting){
    game.switchState(1)
  }else{

    game.switchState(2)
  }
  mainConn.send([4, game.player1.num])


}

function sendData(data, recievers){
  for(let i = 0; i < recievers.length; i++){
    recievers[i].send(data)

  }
}

function connectToId(id){
  let tempConn = peer.connect(id)
  return tempConn
}

function collision(a, b){
  return (a.x < b.x + b.width &&
   a.x + a.width > b.x &&
   a.y < b.y + b.height &&
   a.y + a.height > b.y)
}

function OBBCollide(a, b){

  let newtr = rotateCorner(0,0,b.tr,a.rotation);
  let newtl = rotateCorner(0,0,b.tl,a.rotation);
  let newbr = rotateCorner(0,0,b.br,a.rotation);
  let newbl = rotateCorner(0,0,b.bl,a.rotation);

  //really need to change this bit:
  let maxAx = Math.max(a.tr.x,a.tl.x,a.br.x,a.bl.x)
  let minAx = Math.min(a.tr.x,a.tl.x,a.br.x,a.bl.x)
  let maxAy = Math.max(a.tr.y,a.tl.y,a.br.y,a.bl.y)
  let minAy = Math.min(a.tr.y,a.tl.y,a.br.y,a.bl.y)

  let maxBx = Math.max(newtr.x,newtl.x,newbr.x,newbl.x)
  let minBx = Math.min(newtr.x,newtl.x,newbr.x,newbl.x)
  let maxBy = Math.max(newtr.y,newtl.y,newbr.y,newbl.y)
  let minBy = Math.min(newtr.y,newtl.y,newbr.y,newbl.y)

  if(maxAx < minBx || maxBx < minAx || maxAy < minBy || maxBy < minAy){
    return false
  }
  let newAtr = rotateCorner(0,0,a.tr,b.rotation);
  let newBtl = rotateCorner(0,0,a.tl,b.rotation);
  let newBbr = rotateCorner(0,0,a.br,b.rotation);
  let newBbl = rotateCorner(0,0,a.bl,b.rotation);

  maxBx = Math.max(b.tr.x,b.tl.x,b.br.x,b.bl.x)
  minBx = Math.min(b.tr.x,b.tl.x,b.br.x,b.bl.x)
  maxBy = Math.max(b.tr.y,b.tl.y,b.br.y,b.bl.y)
  minBy = Math.min(b.tr.y,b.tl.y,b.br.y,b.bl.y)

  maxAx = Math.max(newtr.x,newtl.x,newbr.x,newbl.x)
  minAx = Math.min(newtr.x,newtl.x,newbr.x,newbl.x)
  maxAy = Math.max(newtr.y,newtl.y,newbr.y,newbl.y)
  minAy = Math.min(newtr.y,newtl.y,newbr.y,newbl.y)

  if(maxAx < minBx || maxBx < minAx || maxAy < minBy || maxBy < minAy){
    return false
  }
  return true
}

function rotateCorner(cx, cy, corner, rotation){
  if(rotation%Math.PI*2 == 0){
    return({x:corner.x,y:corner.y})
  }
  let tempR = rotation -Math.PI/2
  let tempX = corner.x-cx;
  let tempY = corner.y-cy;

  let rtdX = tempX*Math.cos(tempR) - tempY*Math.sin(-tempR);
  let rtdY = tempX*Math.sin(-tempR) + tempY*Math.cos(tempR);

  return({x:rtdX+cx,y:-rtdY+cy})

}

function moveCorners(c1, c2, c3, c4, x, y){
  c1.x += x;
  c1.y += y;
  c2.x += x;
  c2.y += y;
  c3.x += x;
  c3.y += y;
  c4.x += x;
  c4.y += y;

}

function addText(string, x, y, size, color){
  ctx.save();
  ctx.font = size+"px Arial";
  ctx.fillStyle = color;
  ctx.strokeText(string, x, y);
  ctx.restore();
}


//Button functions
function hostButton(){
    hosting = true
    console.log('HOSTING')
    mid.innerHTML = "Your ID: " + peerId.toString();
    game.switchMenu(game.menus.host)
}

function joinButton(){
	console.log("JOIN")
	document.getElementById("peerId").style.visibility = "visible";
  hosting = false
    game.switchMenu(game.menus.join)

}

function startButton(){
  if(!game.player2){
    mainConn.send(2)

  }
  else{
	  mid.innerHTML = "No one has connected yet..."
  }
  mainConn.send([2]);
  startGame();
  game.switchState(1)
  mid.innerHTML = ""



}

function readyButton(){

	mainConn.send([1,peerId])
}

function connectButton(){

  console.log("connectButton")

  document.getElementById("peerId").style.visibility = "hidden";

  mainConn = connectToId(document.getElementById('peerId').value)
  mainConn.send([1, peerId])
  console.log(mainConn,mainConn.id, peerId)
  game.switchMenu(game.menus.ping)
  hosting = false
  mid.innerHTML = ""

}

function singlePlayerButton(){
  game.switchState(3)
}

function changeChar(num){

  game.player1 = new Player(num)
  game.switchMenu(game.menus.main)
}

function characterSelect(){
	game.switchMenu(game.menus.charSelect)


}

function howToPlay(){

	game.switchMenu(game.menus.howToPlay)
}




class Tile{
  constructor(x, y, width, height, type, collision){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = document.getElementById(type);
    this.collision = collision;
  }
}

class menuButton{
  constructor(x, y, width, height, text, func, font, size){
    this.x = x;
    this.y = y;
    this.text = document.createTextNode(text);
    this.width = width;
    this.height = height;
    this.func = func;
    this.button = document.createElement('button');
    this.button.appendChild(this.text);
    this.button.style.left = x.toString()+"px";
    this.button.style.bottom = (HEIGHT-y).toString()+"px";
    this.button.style.width = this.width.toString() + "px";
    this.button.style.height = this.height.toString() + "px";
    this.button.classList.add('menuButton')
    this.image = document.getElementById('Nbutton')
    this.buttonNum = totalMenuButtons;
    this.button.onclick=func
    console.log(this.button)
    totalMenuButtons++
    this.deactivate();
    document.getElementById('canvasDiv').appendChild(this.button)
    document.getElementById('canvasDiv').appendChild(document.createElement('p'))
  }
  draw(x, y){
    ctx.drawImage(this.image, x, this.y+5+this.buttonNum*66, this.width, this.height)
  }
  activate(){
    this.button.disabled = false;
    this.button.style.zIndex = 2;
  }
  deactivate(){
    this.button.disabled = true;
    this.button.style.zIndex = -2;
  }

}

class Attack{
  constructor(x, y, rotation, image, size, frames, type, player){
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

    this.loop = //sprites[image].loop;
    this.ticksPerFrame = this.frames/this.totalFrames;
    this.player = player
    this.hitPlayers = [];

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
    console.log(player)
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
      console.log(this.player.x,this.player.y)
      this.player.moveX(Math.cos(this.angle)*this.distance/this.moveFrames)
      console.log(Math.cos(this.angle), this.distance, this.moveFrames)
      this.player.moveY(Math.sin(this.angle)*this.distance/this.moveFrames)
    }
    else{

    }
    this.frame++
  }
}

class Player{
  constructor(num){
    this.num = num
    this.attacks = {};
    this.basicAttackImg = playerData.images[num].attack
    this.image = playerData.images[num].down
    this.x = WIDTH/2;
    this.y = HEIGHT/2;
    this.maxHealth = 100
    this.health = 100;
    this.speed = 6;
    this.facing = 0;
    this.width = 32;
    this.height = 42;
    this.frameX = 0;
    this.activeAttacks = [];
    this.movements = [];
    this.walking = false
    this.downImg=playerData.images[num].down
    this.upImg=playerData.images[num].up
    this.leftImg=playerData.images[num].left
    this.rightImg=playerData.images[num].right
    this.attackImg= playerData.images[num].attack
    this.rotation = 0
    console.log(this.downImg, 500)
    //collision variables
    this.tr= {x:this.x+this.width,y:this.y}
    this.br= {x:this.x+this.width,y:this.y+this.height}
    this.tl= {x:this.x,y:this.y}
    this.bl= {x:this.x,y:this.y+this.height}

    this.basicAttackX = 0

    this.basicAttackDelay = 0
    this.angle = 0

    this.delay = 0

    this.cooldownEffects = {"moveLock":0,"autoCd":0, "rolling":0, "invulnerability":0}
    this.effects = {}
    this.cooldowns = ["moveLock", "autoCd", "rolling", "invulnerability"]

  }

  draw(x, y){


    if(this.frameX%2 == 0 && this.cooldownEffects["invulnerability"] > 0){
      ctx.globalAlpha = .7
    }
    ctx.drawImage(document.getElementById(this.image),32*this.frameX, 0, 32, 42, x, y, this.width, this.height);
    ctx.globalAlpha = 1
    this.drawHealth(x, y-20)
    if(boxes){
      ctx.beginPath();
      ctx.strokeRect(this.x,this.y,this.width,this.height);
      ctx.stroke();
      for(let i = 0; i < this.movements.length; i++){
        this.movements[i].draw()
      }
    }

  }
  incrementFrame(numFrames) {
    this.frameX += 1
    if(this.frameX >= numFrames){
      this.frameX -= numFrames
    }
  }

  basicAttack(){



	  if(keys.q in keysDown){

		  ctx.translate(this.x + 16, this.y + 24);

		  ctx.rotate(-this.angle)

		  ctx.translate( - (((this.x + this.x + 40) / 2) + 0 ), - (((this.y + this.y + 40)/2) + 20));
		  ctx.drawImage(document.getElementById(this.basicAttackImg), (64*this.basicAttackX) + 16, 20, 64, 64, this.x, this.y, this.width + 32, this.height + 32)

		  ctx.setTransform(1, 0, 0, 1, 0, 0);

	  if (this.basicAttackDelay < 1) {
		  this.basicAttackDelay += 1;
		} else {
		  if (this.basicAttackX < 7 ) {
			this.basicAttackX += 1;
		  } else {
			this.basicAttackX = 0;
		  }
			this.basicAttackDelay = 0
		}



  }
}

  drawHealth(x, y){
    ctx.save();
    ctx.fillStyle = "red"
    ctx.fillRect(x-this.maxHealth/2, y, this.maxHealth, 10)
    ctx.fillStyle = "green"
    ctx.fillRect(x-this.maxHealth/2, y, this.maxHealth-(this.maxHealth-this.health)/2, 10);
    ctx.restore();
  }

  reduceCooldowns(){

    for(let i = 0; i < this.cooldowns.length; i++){

      this.cooldownEffects[this.cooldowns[i]] -= 1;
    }
  }
  mouseAngle(keyList){

	 this.angle = Math.atan2(this.x+this.width/2 - mouseX, this.y+this.height/2 - mouseY)
   keyList["mouseAngle"] = this.angle
   return this.angle
  }
  moveX(x){
    let noCollision = true;
    for(let i = 0; i <game.mapCollision.length; i++){
      if(collision({x:this.x+x,y:this.y,width:this.width,height:this.height}, game.mapCollision[i])){
        console.log("collide")
        noCollision = false
      }
    }
    if(noCollision){
      this.x+=x
      moveCorners(this.tr, this.br, this.tl, this.bl, x, 0)
    }
    if(this.x < 0){
      this.x = 0
      console.log("resetX")
    }
    if(this.x > (game.map.length-1)*game.tileSize){
      this.x = (game.map.length-1)*game.tileSize
    }
  }
  moveY(y){
    let noCollision = true;
    for(let i = 0; i <game.mapCollision.length; i++){
      if(collision({x:this.x,y:this.y+y,width:this.width,height:this.height}, game.mapCollision[i])){
        console.log("collide")
        noCollision = false
      }
    }
    if(noCollision){
      this.y+=y
      moveCorners(this.tr, this.br, this.tl, this.bl, 0, y)
    }
    if(this.y < 0){
      this.y = 0
      console.log("resetY")
    }

    if(this.y > (game.map[0].length-1)*game.tileSize){

      this.y = (game.map[0].length-1)*game.tileSize
    }
  }

  useMovements(){

    for(let i = 0; i < this.movements.length; i++){
      this.movements[i].move()
      if(this.movements[i].frame >= this.movements[i].frames){
        this.movements.splice(i,1)
        i -=1
      }
    }
  }

  move(keyList){

    let dx = 0,dy = 0, hCollision= false, vCollision = false

    if(keyList['mouseDown'] && this.cooldownEffects["autoCd"] < 0){

      this.activeAttacks.push(playerAttacks[this.num].auto(this.x+this.width/2,this.y+this.height/2, -keyList["mouseAngle"], this))

      this.cooldownEffects["autoCd"] = this.activeAttacks[this.activeAttacks.length-1].cooldown;

      this.cooldownEffects["moveLock"] = this.activeAttacks[this.activeAttacks.length-1].moveLock;

      game.addAttack(this.activeAttacks[this.activeAttacks.length-1])


    }

    if(keys.shift in keyList){
      this.movements.push(playerAttacks[this.num].roll(this))
      this.cooldownEffects["moveLock"] = this.movements[this.movements.length-1].frames
    }

    if(keys.a in keyList){
      dx -= 1
      this.image = this.leftImg

    }

    if(keys.d in keyList){
      dx += 1
      this.image = this.rightImg
    }

    if(keys.w in keyList){
      dy -= 1
      this.image = this.upImg
    }

    if(keys.s in keyList){
      dy += 1
      this.image = this.downImg
    }


    this.facing = Math.atan2(dy, dx)
    if(dy == 0 && dx == 0){

      this.walking = false

    }else{
      this.walking = true
      dx = Math.cos(this.facing)*this.speed;
      dy = Math.sin(this.facing)*this.speed;
    }
    if(keys.space in keyList){

    }

    this.moveX(dx)
    this.moveY(dy)
    

    if(this.x > WIDTH/2 && this.x < game.tileSize*game.map.length-WIDTH/2){
      game.cameraX = this.x
    }
    if(this.y > HEIGHT/2 && this.y < game.tileSize*game.map[0].length-HEIGHT/2){
      game.cameraY = this.y
    }
  }

  applyEffects(effectList){
    for(let i = 0; i< effectList.length; i++){
      effectDict[effectList[i][0]](effectList[i][1], this)
    }
  }
}

class Game{
  constructor(){
    this.player1 = new Player(1)
    this.player2 = new Player(1);

    this.p2Keys = {};
    this.state = 0;
    this.attacks = [];
    this.map = [];
    this.mapAdds = [];
    this.mapCollision = [];
    this.sprites = [];
    this.cameraX = WIDTH/2;
    this.cameraY = HEIGHT/2;
    this.tileSize = 50;
    this.menus = {};
    this.currentMenu = [];
  }
  setup(){
    //this.genNewMap(10, 10);
	  this.map = this.listToMap(MAPS[1].tiles)
    this.mapAdds = this.listToMap(MAPS[1].adds)
    this.mapCollision = this.renderCollision(MAPS[1].collision)
    this.genMenus();
    this.currentMenu = this.menus.main
    this.switchMenu(this.currentMenu);

  }

  genMenus(){
    //x, y, width, height, text, func, font, size
    this.menus ={
      main:[new menuButton(WIDTH/2-100, HEIGHT*1/2-200, 200, 50, 'How to Play', function(){howToPlay()}, 'arial', 15),
		  	    new menuButton(WIDTH/2-100, HEIGHT*1/2-175, 200, 50, 'Character select', function(){characterSelect()}, 'arial', 15),
            new menuButton(WIDTH/2-100, HEIGHT*1/2-150, 200, 50, 'Solo Game', function(){singlePlayerButton()}, 'arial', 15),
            new menuButton(WIDTH/2-100, HEIGHT*1/2-125, 200, 50, 'Host Game', function(){hostButton()}, 'arial', 15),
            new menuButton(WIDTH/2-100, HEIGHT*1/2-100, 200, 50, 'Join Game', function(){joinButton()}, 'arial', 15)],

	    howToPlay:[new menuButton(WIDTH/2-100, HEIGHT*1/2-200, 200, 50, 'Back', function(){game.switchMenu(game.menus.main)}, 'arial', 15),
				],

	    ping:[new menuButton(WIDTH/2-100, HEIGHT*1/2-200, 200, 50, 'Ready?', function(){mainConn.send([1,peerId])}, 'arial', 15)],

      host:[new menuButton(WIDTH/2-100, HEIGHT*1/2-425, 200, 50, 'Start Game', function(){startButton()}, 'arial', 15)],

      join:[new menuButton(WIDTH/2-100, HEIGHT*1/2-400, 200, 50, 'Connect', function(){connectButton()}, 'arial', 15)],

      charSelect:[new menuButton(50,- WIDTH + 100, 200, 50, 'P1', function(){changeChar(1)}, 'arial', 15),
                  new menuButton(50,- WIDTH + 150, 200, 50, 'P2', function(){changeChar(2)}, 'arial', 15),]

    }
  }

  drawMap(map){
    ctx.imageSmoothingEnabled = false

    let cameraMinX = Math.floor((this.cameraX-WIDTH/2)/this.tileSize);
    let cameraMinY = Math.floor((this.cameraY-WIDTH/2)/this.tileSize);


    for(let i = cameraMinX; i < Math.min(map.length, cameraMinX+this.tileSize+1); i++){
      for(let j = cameraMinY; j < Math.min(map[i].length, cameraMinY+this.tileSize+1); j++){
        ctx.drawImage(map[i][j].image, map[i][j].x-this.cameraX+WIDTH/2, map[i][j].y-this.cameraY+HEIGHT/2, this.tileSize, this.tileSize)
      }
    }
  }

  renderCollision(tiles){

    let collideable = false,b = []
    for(let i = 0; i < tiles.length; i++){
	    let c = [];



      for(let j = 0; j < tiles[i].length; j++){

        if(tiles[i][j]===1){
          collideable = true
				  c.push(new Tile(j*this.tileSize/2, i*this.tileSize/2, this.tileSize/2, this.tileSize/2, 'floor', 1))


        }else{
          if(c.length > 0){
          b.push(new Tile(c[0].x, i*this.tileSize/2, c[c.length-1].x-c[0].x+this.tileSize/2, this.tileSize/2))
        }
          c = []
          collideable = false
        }
      if(collideable){
        b.push(new Tile(c[0].x, i*this.tileSize/2, c[c.length-1].x-c[0].x+this.tileSize/2, this.tileSize/2))
      }
      }

    }

    return b

  }

  attackCollision(){

    for(let i = 0; i < this.attacks.length; i++){

      if(this.attacks[i].player == this.player1 && this.player2.cooldownEffects.invulnerability < 0){

        if(OBBCollide(this.player2,this.attacks[i])){
          this.player2.cooldownEffects.invulnerability = 10
          this.player2.applyEffects(this.attacks[i].effects)
          console.log("HIT")
        }
      }else if(this.attacks[i].player == this.player2 && this.player1.cooldownEffects.invulnerability < 0){
        if(OBBCollide(this.player1,this.attacks[i])){
          this.player1.cooldownEffects.invulnerability = 10
          this.player1.applyEffects(this.attacks[i].effects)
          console.log("HIT")
        }
      }
    }
  }

  genNewMap(w, h){
    let a = [];

    for(let i = 0; i< w; i++){
      let b = [];

      for(let j = 0; j<h; j++){
        b.push(new Tile(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize,'floor', 0))




      }
      a.push(b)

    }

    this.map = a
  }

  listToMap(tiles){
    console.log(tiles)
    let target = []
    for(let i = 0; i < tiles.length; i++){
	    let b = [];
      for(let j = 0; j < tiles[i].length; j++){
          switch(tiles[i][j]){
            //Tile Class: X, Y, Width, Height, Type (same as image id in html)



			  case 0:
				  break;

			  case 1:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'floor', 0))
			  	break;

			  case 2:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'rightRockWall', 0))
			  	break;

			  case 3:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'leftRockWall', 0))
			  	break;

			  case 4:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontRockWall', 0))
			  	break;

			  case 5:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontLeftRockWall', 0))
			  	break;

			  case 6:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'frontRightRockWall', 0))
			  	break;

			  case 7:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'topGrass', 0))
			  	break;

			  case 8:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'bottomGrass', 0))
			  	break;

			  case 9:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'leftGrass', 0))
			  	break;

			  case 10:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'rightGrass', 0))
			  	break;

			  case 11:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'topRightGrass', 0))
			  	break;

			  case 12:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'topLeftGrass', 0))
			  	break;

			  case 13:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'bottomRightGrass', 0))
			  	break;

			  case 14:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'bottomLeftGrass', 0))
			  	break;

			  case 15:
				  b.push(new Tile(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, 'grass', 0))
			  	break;




			  }

      }
    target.push(b)
    }


  return target
  }

  addAttack(attack){
    this.attacks.push(attack)
    if(hosting){
    mainConn.send([6, attack.x, attack.y, attack.rotation, attack.image, attack.size, attack.frames, attack.type, undefined])
    }
  }

  drawSprites(){
    for(let i = 0; i < this.attacks.length; i++){
      this.attacks[i].draw(this.attacks[i].x-this.cameraX+WIDTH/2,this.attacks[i].y-this.cameraY+HEIGHT/2);
      if(this.attacks[i].currentFrame==this.attacks[i].totalFrames){
        if(hosting){
        this.attacks[i].player.activeAttacks.splice(i,1)
        }
        this.attacks.splice(i, 1)
        i -= 1
      }
    }
    for(let i = 0; i < this.sprites.length; i++){
      this.sprites[i].draw();
    }
    this.player1.draw(this.player1.x-this.cameraX+WIDTH/2, this.player1.y-this.cameraY+HEIGHT/2)
    if(this.player2){
    this.player2.draw(this.player2.x-this.cameraX+WIDTH/2, this.player2.y-this.cameraY+HEIGHT/2)
  }
  }

  switchMenu(target){
    for(let i = 0; i < this.currentMenu.length; i++){
      this.currentMenu[i].deactivate();
    }
    for(let i = 0; i < target.length; i++){
      target[i].activate();
    }
    this.currentMenu = target;
  }

  drawMenu(menu){
    for(let i = 0;i< menu.length; i++){

      menu[i].draw(menu[i].x, menu[i].y)

    }

  }

  switchState(target){
    ctx.clearRect(0,0,WIDTH,HEIGHT)
    if(this.state == 0){
      for(let i = 0; i< this.currentMenu.length; i++){
        this.currentMenu[i].deactivate();
      }
    }
    if(target == 0){
      for(let i = 0; i< this.currentMenu.length; i++){
        this.currentMenu = this.menus.main;
        this.switchMenu(this.currentMenu);
    }

  }
  this.state = target/1;
}



  stateEngine(){

    switch(this.state){
      case 0:
        ctx.fillRect(0,0,WIDTH,HEIGHT)
        this.drawMenu(this.currentMenu);
        break;
      case 1: //hosting
        this.player1.mouseAngle(keysDown);
        game.player1.useMovements();
        game.player2.useMovements();
        if(this.player1.cooldownEffects.moveLock<=0){
          this.player1.move(keysDown);
        }
        if(this.player2.cooldownEffects.moveLock<=0){
          this.player2.move(this.p2Keys)
        }
        this.attackCollision()
        this.drawMap(this.map);
        this.drawMap(this.mapAdds);

        this.drawSprites();
        //this.player1.basicAttack();
        mainConn.send([5,
                      [this.player1.x,this.player1.y, this.player1.image, this.player1.frameX, this.player1.cooldownEffects,this.player1.health],
                      [this.player2.x,this.player2.y, this.player2.image, this.player2.frameX, this.player2.cooldownEffects,this.player2.health],
                      []])

        break;
      case 2://joining

        this.player1.mouseAngle(keysDown);

        mainConn.send([3, keysDown])
        this.drawMap(this.map);
        this.drawMap(this.mapAdds);
        this.drawSprites();
        break;
      case 3: //singlePlayer
        this.player1.mouseAngle(keysDown);
        this.player1.useMovements();
        if(this.player1.cooldownEffects.moveLock<=0){
          this.player1.move(keysDown);
        }

        this.attackCollision();
        this.drawMap(this.map);
        this.drawMap(this.mapAdds);
        //this.drawMap(this.mapCollision)
        this.drawSprites();
        //this.player1.basicAttack();
    }
  }



}

var game = new Game();
game.setup();

function update(){
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  game.stateEngine()
}

function updateTicks(){

  ticks += 1
  game.player1.reduceCooldowns();
  game.player2.reduceCooldowns();


  if(game.player1.walking && ticks%4 <1){
    game.player1.incrementFrame(2)
  }
  if(game.player2.walking && ticks%4 <1){
    game.player2.incrementFrame(2)
  }
  for(let i = 0; i < game.attacks.length; i++){
    if(ticks%game.attacks[i].ticksPerFrame<1){
      game.attacks[i].incrementFrame()
    }else{

    }
  }
}

var tickCount = setInterval(updateTicks, 50) //50 = 20 times per second (1000/50)
requestInterval(update, frameDelay)
