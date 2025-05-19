import * as PIXI from "pixi.js";
import { getTexture, loadAssets } from "./common/assets";
import appConstants from "./common/constants";
import { initBullets } from "./sprites/bullets";
import { addPlayer, getPlayer } from "./sprites/player";
import { initPeople, restorePeople } from "./sprites/people";
import { initEnemies, addEnemies } from "./sprites/enemy";
import { initBombs } from "./sprites/bombs";
import { initExplosions } from "./sprites/explosions";
import { initInfo } from "./sprites/infoPanel";
import { EventHub } from "./common/eventHub";
import { play } from "./common/sound";
import { getGameOver, getLevelMessage, getYouWin } from "./sprites/messages";
import { checkCollisions } from "./common/collisions";
import { getLevelNumber, isLastLevel, nextLevel, resetLevel } from "./common/levels";
import { addBackground, setBackgroundForLevel } from "./sprites/background";

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;

let rootContainer;
let tickMode = true;

let app;

let autoFire = false

let background;

const createScene = async () => {
  app = new PIXI.Application();
  await app.init({
    width: WIDTH,
    height: HEIGHT,
    antialias: true,
    transparent: false,
    resolution: 1,
    background: "#000000",

  });

  app.gameState = {
    stopped: false,
    moveLeftActive: false,
    moveRightActive: false,
  };

  document.body.appendChild(app.canvas);
  rootContainer = app.stage;
  rootContainer.eventMode = 'static';
  rootContainer.hitArea = app.screen;

  // initInfo(app, rootContainer);

  // const bullets = initBullets(app, rootContainer);
  // rootContainer.addChild(bullets);

  // //const player = addPlayer(app, rootContainer);

  // const people = initPeople(app, rootContainer);
  // //restorePeople();
  // rootContainer.addChild(people);

  // const enemies = initEnemies(app, rootContainer);
  // //addEnemy();
  // rootContainer.addChild(enemies);

  // const bombs = initBombs(app, rootContainer);
  // rootContainer.addChild(bombs);

  // initExplosions(app, rootContainer);

  return app;
};

const initInteraction = () => {
  app.gameState.mousePosition = appConstants.size.WIDTH / 2;

  app.stage.addEventListener("pointermove", (e) => {
    app.gameState.mousePosition = e.global.x;
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      getPlayer().shoot();
    }
  });

  app.ticker.add((delta) => {
    if (tickMode) {
      EventHub.emit(appConstants.events.tick, delta);
    } else {
      checkCollisions((a, b) => {
        if (a.sprite.spriteType !== b.sprite.spriteType) {
          EventHub.emit(appConstants.events.collision, { a, b });
        }
      });
    }

    tickMode = !tickMode;
  });
};

export const initGame = async () => {

  app = await createScene();

  loadAssets((progress) => {
    if (progress === "all") {

      addBackground(app, rootContainer)
      initInfo(app, rootContainer);

      const bullets = initBullets(app, rootContainer);
      rootContainer.addChild(bullets);

      //const player = addPlayer(app, rootContainer);

      const people = initPeople(app, rootContainer);
      //restorePeople();
      rootContainer.addChild(people);

      const enemies = initEnemies(app, rootContainer);
      //addEnemy();
      rootContainer.addChild(enemies);

      const bombs = initBombs(app, rootContainer);
      rootContainer.addChild(bombs);

      initExplosions(app, rootContainer);
      initInteraction();
      rootContainer.addChild(getLevelMessage(getLevelNumber() + 1));
    }
  });
  return
};

const restartGame = () => {
  setTimeout(() => {
    setBackgroundForLevel()
    addPlayer(app, rootContainer);
    addEnemies();
    restorePeople();
  }, 0);
};

EventHub.on(appConstants.events.youWin, () => {
  app.ticker.stop();
  if (isLastLevel()) {
    rootContainer.addChild(getYouWin());
    setTimeout(() => play(appConstants.sounds.youWin), 1000);
  } else {
    nextLevel();
    rootContainer.addChild(getLevelMessage(getLevelNumber() + 1));
  }
});

EventHub.on(appConstants.events.gameOver, () => {
  app.ticker.stop();
  rootContainer.addChild(getGameOver());
  setTimeout(() => play(appConstants.sounds.gameOver), 1000);
});

EventHub.on(appConstants.events.restartGame, (event) => {
  if (event === appConstants.events.gameOver) {
    rootContainer.removeChild(getGameOver());
    resetLevel();
    rootContainer.addChild(getLevelMessage(getLevelNumber() + 1));
  }
  if (event === appConstants.events.youWin) {
    rootContainer.removeChild(getYouWin());
    resetLevel();
    restartGame();
  }
  if (event === appConstants.events.levelMessage) {
    rootContainer.removeChild(getLevelMessage());
    restartGame();
  }
  app.ticker.start();
});
