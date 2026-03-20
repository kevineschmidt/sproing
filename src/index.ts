import World from './world'
import Wall from './wall'
import { Body, Mass, Spring} from './body'
import Vector from './vector'

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

const newBody = new Body()
let activeMass: Mass | null = null
world.objects.push(newBody)

const MASS_RADIUS=5
const MASS_COLOR="red"
const SELECTED_MASS_COLOR="blue"

const undoStack: Array<() => void> = []

document.onkeydown = (event) => {
    if (event.key === 'z' && event.metaKey) {
        if (undoStack.length) {
            const undo = undoStack.pop()
            if (undo) {
                undo()
                world.draw()
            }
        }
        event.preventDefault()
    }
}

canvas.onclick = (event) => {
    const center = new Vector(event.offsetX, event.offsetY)

    const clickedMass = newBody.masses.find((mass) => {
        return center.sub(mass.position).length() < MASS_RADIUS * 2
    })
    if (clickedMass && clickedMass !== activeMass) {
        if (!activeMass) {
            activeMass = clickedMass 
            activeMass.color = SELECTED_MASS_COLOR
        }
        else {
            const dist = activeMass.position.sub(clickedMass.position).length()
            const spring = new Spring(activeMass, clickedMass, 4000, dist)
            newBody.springs.push(spring)
            undoStack.push(() => {
                newBody.springs = newBody.springs.filter(s => s !== spring)
            })
            activeMass.color = "red"
            activeMass = null
        }
    } else {
        if (activeMass) activeMass.color = MASS_COLOR
        const newMass = new Mass(MASS_RADIUS, center.x, center.y, MASS_COLOR)

        undoStack.push(() => {
            newBody.masses = newBody.masses.filter(m => m !== newMass)
        })

        newBody.masses.push(newMass)
    }

    world.draw()
}

button.onclick = () => {
    if (world.animating) world.stop()
    else world.animate()
}

world.draw()