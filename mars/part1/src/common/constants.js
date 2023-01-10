const appConstants = {
    size: {
        WIDTH: window.innerWidth ? window.innerWidth : 800,
        HEIGHT: window.innerHeight ? window.innerHeight : 600,
    },
    containers: {
        player: 'player',
        bullets: 'bullets',
    },
    timeouts: {
        playerLock: 2000,
        playerShoots: 1000,
    }
}

export default appConstants