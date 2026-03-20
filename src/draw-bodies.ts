import { Mass, Body, Spring } from './body'
import type World from './world'

import Vector from './vector'

const MASS_RADIUS=5
const MASS_COLOR="red"

let newBody = new Body()
let lastMass: Mass | null = null
let firstMass: Mass | null = null
const undoStack: Array<() => void> = []



function massAtPoint(pos: Vector) {
    return newBody.masses.find((mass) => {
        return pos.sub(mass.position).length() < MASS_RADIUS * 2
    }) ?? null
}

function addNewSpring(m1: Mass, m2: Mass) {
    const newSpring = new Spring(m1, m2, 5000, m1.position.sub(m2.position).length())

    newBody.springs.push(newSpring)
    return newSpring
}

function addNewMass(pos: Vector) {
    const newMass = new Mass(MASS_RADIUS, pos.x, pos.y, MASS_COLOR)

    newBody.masses.push(newMass)
    return newMass
}

function findSpring(m1: Mass, m2: Mass) {
    return newBody.springs.find((spring) => {
        return spring.mass1 === m1 && spring.mass2 === m2 ||
            spring.mass1 === m2 && spring.mass2 === m1
    })
}

function joinAllMasses() {
    newBody.masses.forEach(m1 => {
        newBody.masses.forEach(m2 => {
            if (m1 === m2) return
            if (findSpring(m1, m2)) return
            addNewSpring(m1, m2)
        })
    })    
}


export function addBodyDrawing(world: World, canvas: HTMLCanvasElement) {

    world.objects.push(newBody)
    document.onkeydown = (event) => {
        if (event.key === 'z' && event.metaKey) {

            const undo = undoStack.pop()
            if (undo) {
                undo()
                world.draw()
            }

            event.preventDefault()
        }
    }


    canvas.onmousedown = (event) => {
        const start = new Vector(event.offsetX, event.offsetY)
        lastMass = massAtPoint(start)
        if (!lastMass) {
            lastMass = addNewMass(start)
        }
        firstMass = lastMass
    }

    canvas.onmouseup = (event) => {
        if (!firstMass || !lastMass) return

        const pos = new Vector(event.offsetX, event.offsetY)
        addNewSpring(firstMass, lastMass).perimeter = true
        firstMass = null
        lastMass = null
        joinAllMasses()

        // Get the next one ready
        newBody = new Body()
        world.objects.push(newBody)
        
        world.draw()
    }

    canvas.onmousemove = (event) => {
        if (!lastMass) return

        const pos = new Vector(event.offsetX, event.offsetY)
        const thisDrag =  (pos.sub(lastMass.position).length() > 10)
        if (thisDrag) {
            const newMass = addNewMass(pos)
            addNewSpring(lastMass, newMass).perimeter = true
            lastMass = newMass
            world.draw()
        }
    }
}