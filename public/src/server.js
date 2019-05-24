class Server{
  constructor(id = null, mapId = 1){
    this.serverId = id;
    this.players = []
    this.mapId = mapId;
    this.tiles = MAPS[mapId].tiles;
    this.mapAdds = MAPS[mapId].adds;
    this.collisionMap = MAPS[mapId].collision;

  }
  setMap(mapId){
    this.mapId = mapId;
    this.tiles = MAPS[mapId].tiles;
    this.mapAdds = MAPS[mapId].adds;
    this.collisionMap = MAPS[mapId].collision;
  }
}
