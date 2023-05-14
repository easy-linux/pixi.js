import * as PIXI from "pixi.js";
import { root } from "postcss";
import { loadAssets } from "./common/assets";
import appConstants from "./common/constants";
import { bulletTick, clearBullets, destroyBullet, initBullets } from "./sprites/bullets";
import { addPlayer, getPlayer, lockPlayer, playerShoots, playerTick } from "./sprites/player";
import { destroyPerson, initPeople, peopleTick, restorePeople } from "./sprites/people";
import { initEnemies, addEnemy, enemyTick, destroyEmeny } from "./sprites/enemy";
import { bombTick, clearBombs, destroyBomb, initBombs } from "./sprites/bombs";
import { checkCollision, destroySprite } from "./common/utils";
import { initExplosions, explosionTick } from "./sprites/explosions";
import { initInfo } from "./sprites/infoPanel";
import { EventHub } from "./common/eventHub";
import { play } from "./common/sound";
import { getGameOver, getYouWin } from "./sprites/messages";


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

  initInfo(app, rootContainer);

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
    const toRemove = [];
    bullets.children.forEach((b) => {
      enemies.children.forEach((e) => {
        if (e && b) {
          if (checkCollision(e, b)) {
            toRemove.push(b);
            toRemove.push(e);
            // destroyBullet(b);
            // destroyEmeny(e);
          }
        }
      });
    });
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
    });
  }
  if (bombs && bullets) {
    const toRemove = [];
    bombs.children.forEach((bomb) => {
      bullets.children.forEach((b) => {
        if (checkCollision(bomb, b)) {
          toRemove.push(b);
          toRemove.push(bomb);
          // destroyBullet(b);
          // destroyBomb(bomb);
        }
      });
    });
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
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
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
    });
  }
  if (bombs && people) {
    const toRemove = [];
    bombs.children.forEach((bomb) => {
      people.children.forEach((p) => {
        if (bomb && p) {
          if (checkCollision(bomb, p)) {
            if (toRemove.indexOf(p) === -1) {
              toRemove.push(p);
            }
            if (toRemove.indexOf(bomb) === -1) {
              toRemove.push(bomb);
            }
          }
        }
      });
    });

    toRemove.forEach((sprite) => {
      sprite.destroyMe();
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

const restartGame = () => {
  clearBombs()
  clearBullets()
  restorePeople()
}

EventHub.on(appConstants.events.youWin, () => {
  gameState.app.ticker.stop()
  rootContainer.addChild(getYouWin())
  setTimeout(() => play(appConstants.sounds.youWin), 1000)
})

EventHub.on(appConstants.events.gameOver, () => {
  gameState.app.ticker.stop()
  rootContainer.addChild(getGameOver())
  setTimeout(() => play(appConstants.sounds.gameOver), 1000)
})

EventHub.on(appConstants.events.restartGame, (event) => {
  restartGame()
  if(event === appConstants.events.gameOver){
    rootContainer.removeChild(getGameOver())

  }
  if(event === appConstants.events.youWin){
    rootContainer.removeChild(getYouWin())
  }
  gameState.app.ticker.start()
})
