import { getAlivePeople, getRandomAlivePerson } from "./people";
import { allTextureKeys } from "../common/textures";
import { getTexture } from "../common/assets";
import { Container, AnimatedSprite } from "pixi.js";
import appConstants from "../common/constants";
import { randomIntFromInterval, destroySprite } from "../common/utils";
import { addBomb } from "./bombs";
import { addExplosion } from "./explosions";
import { ufoDestroyed } from "../common/eventHub";

let enemies;
let app;
let rootContainer;

export const initEnemies = (currApp, root) => {
  enemies = new Container();
  enemies.name = appConstants.containers.enemies;
  app = currApp;
  rootContainer = root;
  return enemies;
};

export const destroyEmeny = (enemy) => {
  addExplosion({ x: enemy.position.x, y: enemy.position.y });
  destroySprite(enemy);
  ufoDestroyed();
  setTimeout(() => {
    addEnemy();
  }, 1000);
};

export const addEnemy = () => {
  const textures = [getTexture(allTextureKeys.shipBlue), getTexture(allTextureKeys.shipBlue2)];
  const enemy = new AnimatedSprite(textures);
  enemy.anchor.set(0.5, 1);
  const alivePerson = getRandomAlivePerson();
  if (alivePerson) {
    enemy.position.x = alivePerson;
  } else {
    enemy.x = randomIntFromInterval(20, appConstants.size.WIDTH - 20);
  }
  enemy.y = 80;
  enemy.scale.set(0.5);

  enemy.animationSpeed = 0.1;
  enemy.customData = {
    left: true,
  };

  enemy.destroyMe = function () {
    destroyEmeny(this);
  };
  enemies.addChild(enemy);

  return enemy;
};

export const enemyTick = () => {
  const allAlive = getAlivePeople();

  enemies.children.forEach((e) => {
    let directionChanged = false;
    if (e.customData.left) {
      e.position.x -= 1;
      if (e.position.x < 20) {
        e.customData.left = false;
        directionChanged = true;
      }
    } else {
      e.position.x += 1;
      if (e.position.x > appConstants.size.WIDTH - 20) {
        e.customData.left = true;
        directionChanged = true;
      }
    }

    if (!directionChanged && Math.random() * 100 < appConstants.probability.enemyChangeDirection) {
      e.customData.left = !e.customData.left;
      const idx = randomIntFromInterval(0, 1);
      e.gotoAndStop(idx);
    }

    const underPerson = allAlive.filter((p) => {
      return p - 10 <= e.position.x && p + 10 >= e.position.x;
    });

    if (underPerson.length) {
      if (Math.random() * 100 < appConstants.probability.bomb) {
        //generate bomb
        addBomb(e.position);
      }
    } else {
      if (Math.random() * 100 < appConstants.probability.bomb / 4) {
        //generate bomb

        addBomb(e.position);
      }
    }
  });
};
