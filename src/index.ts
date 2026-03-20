import World from './world'
import Wall from './wall'
import { addBodyDrawing } from './draw-bodies'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const button = document.querySelector('#start-stop-button') as HTMLButtonElement
const world = new World(canvas)

world.walls = [
    new Wall(0, 0, 0, canvas.height),
    new Wall(canvas.width, canvas.width, canvas.height, 0),
    new Wall(0, canvas.width, canvas.height, canvas.height),
    new Wall(0, canvas.width/2, canvas.height*.5, canvas.height*4/5),
    new Wall(canvas.width / 2, canvas.width, 200, 75),
    new Wall(300, 500, 430, 350)
]

addBodyDrawing(world, canvas)

button.onclick = () => {
    if (world.animating) world.stop()
    else world.animate()
}

world.draw()