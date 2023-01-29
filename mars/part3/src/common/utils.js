

export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const checkCollision = (obj1, obj2) => {
    const bounds1 = obj1.getBounds()
    const bounds2 = obj2.getBounds()

    return bounds1.x < bounds2.x + bounds2.width &&
           bounds1.y < bounds2.y + bounds2.height &&
           bounds2.x < bounds1.x + bounds1.width &&
           bounds2.y < bounds1.y + bounds1.height
}