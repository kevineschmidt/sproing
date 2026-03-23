import World from './world'
import Wall from './wall'
import { setDrawMode, addDrawMode } from './draw-mode'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const button = document.querySelector('#start-stop-button') as HTMLButtonElement

const world = new World(canvas)
addDrawMode(world, canvas)

document.querySelectorAll('input[type="radio"]').forEach((button: Element) => {
    (button as HTMLInputElement).onchange = (e: Event) => {

        const value = e.target instanceof HTMLInputElement ? e.target.value : null
        if (value === 'wall') {
           setDrawMode('wall')
        } else if (value === 'body') {
            setDrawMode('body')
        }
    }
})

world.walls = [
    new Wall(0, 0, 0, canvas.height),
    new Wall(canvas.width, canvas.width, canvas.height, 0),
    new Wall(0, canvas.width, canvas.height, canvas.height),
]



button.onclick = () => {
    if (world.animating) world.stop()
    else world.animate()
}

world.draw()