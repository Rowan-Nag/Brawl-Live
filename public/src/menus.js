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
    document.getElementById("peerId").style.visibility = "visible";
    //mid.innerHTML = "Your ID: " + peerId.toString();
    game.switchMenu(game.menus.host)

}

function createServerButton(){ ////////////////////////////////////////////////////////////////////////////////////////////
  sID = document.getElementById('peerId').value;
  if(sID.length > 3){
    createServer(sID, 1)
    game.switchState(4)
  }
}

function joinServerButton(){
  sID = document.getElementById('peerId').value;
  console.log('joining server ', sID)
  if(sID.length > 3){
    joinServer(sID)

  }
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

  game.player1 = new Player(num, 0)
  game.switchMenu(game.menus.main)
}

function characterSelect(){
	game.switchMenu(game.menus.charSelect)


}

function howToPlay(){

	game.switchMenu(game.menus.howToPlay)
}
