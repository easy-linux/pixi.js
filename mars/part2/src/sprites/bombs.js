import { Container, Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { allTextureKeys } from "../common/textures";

let app;
let bombs;
let rootContainer;

const bombSpeed = 1;

export const initBombs = (currApp, root) => {
  bombs = new Container();
  bombs.name = appConstants.containers.bombs;
  app = currApp;
  rootContainer = root;
  return bombs;
};

export const clearBombs = () => {
  const toRemove = [];
  bombs.children.forEach((b) => {
    toRemove.push(b);
  });
  toRemove.forEach((b) => {
    bombs.removeChild(b);
    b.destroy({ children: true });
  });
};

export const addBomb = (coord) => {
  const bomb = new Sprite(getTexture(allTextureKeys.bomb));
  bomb.anchor.set(0.5);
  bomb.position.set(coord.x, coord.y + 10);
  bomb.rotation = Math.PI;
  bomb.scale.set(0.3);
  bombs.addChild(bomb);
};

export const bombTick = () => {
  const toRemove = [];
  bombs.children.forEach((b) => {
    b.position.y += bombSpeed * 2;
    if (b.position.y > appConstants.size.HEIGHT) {
      toRemove.push(b);
    }
  });
  toRemove.forEach((b) => {
    bombs.removeChild(b);
    b.destroy({ children: true });
  });
};
