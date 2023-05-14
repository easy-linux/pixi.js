import { Container, Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { allTextureKeys } from "../common/textures";
import { randomIntFromInterval, destroySprite } from "../common/utils";
import { manKilled, resetPeople } from "../common/eventHub";

let app;
let rootContainer;
let people;
let aliveCoords = [];
let peopleFrames = null;
let tombStoneFrames = null;

export const initPeople = (currApp, root) => {
  if (!peopleFrames) {
    peopleFrames = [getTexture(allTextureKeys.man), getTexture(allTextureKeys.man2), getTexture(allTextureKeys.woman)];
  }
  if (!tombStoneFrames) {
    tombStoneFrames = [getTexture(allTextureKeys.TombStone1), getTexture(allTextureKeys.TombStone2)];
  }
  people = new Container();
  people.name = appConstants.containers.people;
  app = currApp;
  rootContainer = root;
  return people;
};

let x = 10;
let y = appConstants.size.HEIGHT;

const recalculateAlivePeople = () => {
  const result = [];
  people.children.forEach((p) => {
    if (p.alive) {
      result.push(p.position.x);
    }
  });
  aliveCoords = [...result];
};

export const destroyPerson = (p) => {
  const pos = { x: p.position.x, y: p.position.y };

  if (p.alive) {
    const frameName = tombStoneFrames[randomIntFromInterval(0, tombStoneFrames.length-1)];
    const tombStone = new Sprite(frameName);
    tombStone.anchor.set(0.5, 1);
    tombStone.alive = false;
    tombStone.name = p.name;
    tombStone.position.x = pos.x;
    tombStone.position.y = y + 100;
    tombStone.destroyMe = p.destroyMe

    
    destroySprite(p)
    people.addChild(tombStone);
    manKilled()
    recalculateAlivePeople();
  } else {
    destroySprite(p)
  }
};

export const restorePeople = () => {
  aliveCoords.length = 0;
  x = 30;
  y = appConstants.size.HEIGHT;

  const toRemove = [];

  people.children.forEach((p) => {
    toRemove.push(p);
  });

  toRemove.forEach((p) => {
    people.removeChild(p);
    p.destroy({ children: true });
  });

  let i = 0;

  while (x < appConstants.size.WIDTH) {
    const frameName = peopleFrames[randomIntFromInterval(0, peopleFrames.length-1)];
    const man = new Sprite(frameName);
    man.anchor.set(0.5, 1);
    man.name = i;
    man.alive = true;
    man.position.x = x;
    man.position.y = y;
    x += man.width + 10;
    man.destroyMe = function(){
      destroyPerson(this)
    }
    people.addChild(man);
    i++
  }
  resetPeople({count: people.children.length})
  recalculateAlivePeople();
};


export const getAlivePeople = () => {
  return [...aliveCoords];
};

export const getRandomAlivePerson = () => {
  const allAlive = getAlivePeople();
  if (allAlive.length) {
    return allAlive[randomIntFromInterval(0, allAlive.length-1)];
  }
  return null;
};

export const peopleTick = () => {
  people.children.forEach((p) => {
    if (p.position.y > y) {
      p.position.y -= 1;
    }
  });
};
