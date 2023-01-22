const appConstants = {
    size: {
        WIDTH: window.innerWidth ? window.innerWidth : 800,
        HEIGHT: window.innerHeight ? window.innerHeight : 600,
    },
    containers: {
        player: 'player',
        bullets: 'bullets',
        people: 'people',
        enemies: 'enemies',
        bombs: 'bombs',
    },
    timeouts: {
        playerLock: 2000,
        playerShoots: 1000,
    },
    probability: {
        enemyChangeDirection: 1,
        bomb: 3,
    }
}

export default appConstants