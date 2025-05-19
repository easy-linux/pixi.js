import { Container, Graphics, Text, TextStyle, FillGradient } from "pixi.js";
import appConstants from "../common/constants";
import { restartGame } from "../common/eventHub";

const gradient = new FillGradient({
  type: 'linear',
  start: { x: 0, y: 0 },  // Start at top
  end: { x: 0, y: 1 },
  colorStops: [
    { offset: 0, color: 0xffffff },
    { offset: 1, color: 0x00ff99 },
  ],
  textureSpace: 'local'
});

const style = new TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fontStyle: "normal",
  fontWeight: "bold",
  fill: gradient,
  stroke: { color: 0x4a1850, strokeThickness: 5 },
  dropShadow: {color: 0x000000, blur: 4, distance: 6},
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: "round",
});

const gameOverMessage = new Container();
gameOverMessage.eventMode = 'static';

const graphics = new Graphics();

graphics.stroke({ width: 1, color: 0xff00ff, alpha: 1 });
graphics.fill({ color: 0x650a5a, alpha: 0.25 });
graphics.roundRect(0, 0, 250, 100, 16);

gameOverMessage.addChild(graphics);

const text = new Text({text: "Game Over", style});
text.anchor.set(0.5);
text.x = 250 / 2;
text.y = 100 / 2;
gameOverMessage.addChild(text);
gameOverMessage.on("pointertap", () => {
  restartGame(appConstants.events.gameOver);
});

export const getGameOver = () => {
  gameOverMessage.position.x = appConstants.size.WIDTH / 2 - gameOverMessage.width / 2;
  gameOverMessage.position.y = appConstants.size.HEIGHT / 2 - gameOverMessage.height / 2;
  return gameOverMessage;
};

const youWinMessage = new Container();
youWinMessage.eventMode = 'static';

const graphics2 = new Graphics();

graphics2.stroke({ width: 1, color: 0xff00ff, alpha: 1 });
graphics2.fill({ color: 0x650a5a, alpha: 0.25 });
graphics2.roundRect(0, 0, 250, 100, 16);

youWinMessage.addChild(graphics2);

const text2 = new Text({text: "You Win!", style});
text2.anchor.set(0.5);
text2.x = 250 / 2;
text2.y = 100 / 2;
youWinMessage.addChild(text2);
youWinMessage.on("pointertap", () => {
  restartGame(appConstants.events.youWin);
});

export const getYouWin = () => {
  youWinMessage.position.x = appConstants.size.WIDTH / 2 - youWinMessage.width / 2;
  youWinMessage.position.y = appConstants.size.HEIGHT / 2 - youWinMessage.height / 2;
  return youWinMessage;
};

const levelMessage = new Container();
levelMessage.eventMode = 'static';

const graphics3 = new Graphics();
// graphics3.lineStyle(1, 0xff00ff, 1);
// graphics3.beginFill(0x650a5a, 0.25);
// graphics3.drawRoundedRect(0, 0, 250, 100, 16);
// graphics3.endFill();
graphics3.stroke({ width: 1, color: 0xff00ff, alpha: 1 });
graphics3.fill({ color: 0x650a5a, alpha: 0.25 });
graphics3.roundRect(0, 0, 250, 100, 16);

levelMessage.addChild(graphics3);

const text3 = new Text({text: "Level ", style});
text3.anchor.set(0.5);
text3.x = 250 / 2;
text3.y = 100 / 2;
levelMessage.addChild(text3);
levelMessage.on("pointertap", () => {
  restartGame(appConstants.events.levelMessage);
});

export const getLevelMessage = (level) => {
  text3.text = "Level " + level;
  levelMessage.position.x = appConstants.size.WIDTH / 2 - levelMessage.width / 2;
  levelMessage.position.y = appConstants.size.HEIGHT / 2 - levelMessage.height / 2;
  return levelMessage;
};
