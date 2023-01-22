import * as PIXI from 'pixi.js'
import { root } from 'postcss'
import { loadAssets } from './common/assets'
import appConstants from './common/constants'
import { bulletTick, initBullets } from './sprites/bullets'
import { addPlayer, getPlayer, playerShoots, playerTick } from './sprites/player'
import { initPeople, peopleTick, restorePeople, } from './sprites/people'
import { initEnemies, addEnemy, enemyTick} from './sprites/enemy'
import { bombTick, initBombs } from './sprites/bombs'

const WIDTH = appConstants.size.WIDTH
const HEIGHT = appConstants.size.HEIGHT

const gameState = {
    stopped: false,
    moveLeftActive: false,
    moveRightActive: false,
}

const createScene = () => {
    const app = new PIXI.Application({
        background: '#000000',
        antialias: true,
        width: WIDTH,
        height: HEIGHT,
    })
    document.body.appendChild(app.view)
    gameState.app = app
    const rootContainer = app.stage
    rootContainer.interactive = true
    rootContainer.hitArea = app.screen

    const bullets = initBullets(app, rootContainer)
    rootContainer.addChild(bullets)

    const player = addPlayer(app, rootContainer)
    rootContainer.addChild(player)

    const people = initPeople(app, rootContainer)
    restorePeople()
    rootContainer.addChild(people)

    const enemies = initEnemies(app, rootContainer)
    addEnemy()
    rootContainer.addChild(enemies)

    const bombs = initBombs(app, rootContainer)
    rootContainer.addChild(bombs)

    return app
}

const initInteraction = () => {
    console.log('initInteraction')
    gameState.mousePosition = getPlayer().position.x

    gameState.app.stage.addEventListener("pointermove", (e) => {
        gameState.mousePosition = e.global.x
    })

    document.addEventListener("keydown", (e) => {
        if(e.code === 'Space'){
            playerShoots()
        }
    })

    gameState.app.ticker.add((delta) => {
        playerTick(gameState)
        bulletTick()
        peopleTick()
        enemyTick()
        bombTick()
    })
}

export const initGame = () => {
   loadAssets((progress) => {
     if(progress === 'all'){
        createScene()
        initInteraction()
     }
   })

}