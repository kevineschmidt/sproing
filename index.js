const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')


const BACKGROUND="black"
const SPRING="orange"


const anchor = [canvas.width / 2, 0]
const block = [canvas.width / 2, canvas.height /2]
const IDEAL_LENGTH = canvas.height / 3
const SPRING_CONSTANT = 2
const blockVel = [0, 0]

const BLOCK_MASS=10


let gravity = new Vector(0, 980)
let lastTime = performance.now()
const object = createTallRect(440, 10, 20, 5)

const walls = [
    new Wall(0, 0, 0, canvas.height),
    new Wall(canvas.width, canvas.width, canvas.height, 0),
    new Wall(0, canvas.width, canvas.height, canvas.height),
    new Wall(0, canvas.width/2, canvas.height*.5, canvas.height*4/5),
    new Wall(canvas.width / 2, canvas.width, 200, 75),
    new Wall(300, 500, 430, 350)
]

function draw() {
    // const now = performance.now()
    // const deltaT = (now - lastTime)/1000
    // lastTime = now
    const deltaT = .01
    context.fillStyle = BACKGROUND
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    context.strokeStyle = SPRING
    context.fillStyle = SPRING
    walls.forEach(wall => wall.draw(context))
    object.springs.forEach(spring => spring.draw(context))
    object.masses.forEach(mass => mass.draw(context))
    const UPDATES = 50
    for (let i = 0 ; i < UPDATES; ++i) {
        object.springs.forEach(spring => spring.applyForce())
        object.masses.forEach(mass => mass.applyForce(gravity.scale(mass.mass)))
        object.masses.forEach(mass => mass.update(deltaT / UPDATES))
        walls.forEach((wall) => {
            object.masses.forEach(mass => {
                wall.intersect(mass)
            })
        })
    }

    requestAnimationFrame(draw);
}


draw()