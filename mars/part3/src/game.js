import * as PIXI from "pixi.js";
import { root } from "postcss";
import { loadAssets } from "./common/assets";
import appConstants from "./common/constants";
import { bulletTick, destroyBullet, initBullets } from "./sprites/bullets";
import { addPlayer, getPlayer, lockPlayer, playerShoots, playerTick } from "./sprites/player";
import { destroyPerson, initPeople, peopleTick, restorePeople } from "./sprites/people";
import { initEnemies, addEnemy, enemyTick, destroyEmeny } from "./sprites/enemy";
import { bombTick, destroyBomb, initBombs } from "./sprites/bombs";
import { checkCollision } from "./common/utils";
import { initExplosions, explosionTick } from "./sprites/explosions";

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;

const gameState = {
  stopped: false,
  moveLeftActive: false,
  moveRightActive: false,
};

let rootContainer;

const createScene = () => {
  const app = new PIXI.Application({
    background: "#000000",
    antialias: true,
    width: WIDTH,
    height: HEIGHT,
  });
  document.body.appendChild(app.view);
  gameState.app = app;
  rootContainer = app.stage;
  rootContainer.interactive = true;
  rootContainer.hitArea = app.screen;

  const bullets = initBullets(app, rootContainer);
  rootContainer.addChild(bullets);

  const player = addPlayer(app, rootContainer);
  rootContainer.addChild(player);

  const people = initPeople(app, rootContainer);
  restorePeople();
  rootContainer.addChild(people);

  const enemies = initEnemies(app, rootContainer);
  addEnemy();
  rootContainer.addChild(enemies);

  const bombs = initBombs(app, rootContainer);
  rootContainer.addChild(bombs);

  initExplosions(app, rootContainer);

  return app;
};

const checkAllCollisions = () => {
  const enemies = rootContainer.getChildByName(appConstants.containers.enemies);
  const bullets = rootContainer.getChildByName(appConstants.containers.bullets);
  const people = rootContainer.getChildByName(appConstants.containers.people);
  const bombs = rootContainer.getChildByName(appConstants.containers.bombs);
  const player = rootContainer.getChildByName(appConstants.containers.player);

  if (enemies && bullets) {
    bullets.children.forEach((b) => {
      enemies.children.forEach((e) => {
        if (e && b) {
          if (checkCollision(e, b)) {
            destroyBullet(b);
            destroyEmeny(e);
          }
        }
      });
    });
  }
  if (bombs && bullets) {
    bombs.children.forEach((bomb) => {
      bullets.children.forEach((b) => {
        if (checkCollision(bomb, b)) {
          destroyBullet(b);
          destroyBomb(bomb);
        }
      });
    });
  }

  if (bombs && player && !player.locked) {
    const toRemove = [];
    bombs.children.forEach((b) => {
      if (checkCollision(b, player)) {
        toRemove.push(b);
        lockPlayer();
      }
    });
    toRemove.forEach((b) => {
      destroyBomb(b);
    });
  }
  if (bombs && people) {
    const toRemove = [];
    const toRemovePeople = [];
    bombs.children.forEach((bomb) => {
      people.children.forEach((p) => {
        if (bomb && p) {
          if (checkCollision(bomb, p)) {
            if (toRemovePeople.indexOf(p) === -1) {
              toRemovePeople.push(p);
            }
            if (toRemove.indexOf(bomb) === -1) {
              toRemove.push(bomb);
            }
          }
        }
      });
    });

    toRemovePeople.forEach((p) => {
      destroyPerson(p);
    });
    toRemove.forEach((b) => {
      destroyBomb(b);
    });
  }
};

const initInteraction = () => {
  console.log("initInteraction");
  gameState.mousePosition = getPlayer().position.x;

  gameState.app.stage.addEventListener("pointermove", (e) => {
    gameState.mousePosition = e.global.x;
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      playerShoots();
    }
  });

  gameState.app.ticker.add((delta) => {
    playerTick(gameState);
    bulletTick();
    peopleTick();
    enemyTick();
    bombTick();
    explosionTick();
    checkAllCollisions();
  });
};

export const initGame = () => {
  loadAssets((progress) => {
    if (progress === "all") {
      createScene();
      initInteraction();
    }
  });
};
