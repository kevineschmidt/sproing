let lastTime = performance.now()

const BACKGROUND="black"
const SPRING="orange"
const gravity = new Vector(0, 980)

class World {
    constructor(canvas) {
        this.walls = []
        this.objects = []
        this.animationRequest = null
        this.canvas = canvas;
        this.context = canvas.getContext('2d')
        this.animating = false;
    }
    
    stop() {        
        window.cancelAnimationFrame(this.animationRequest)
        this.animationRequest = null
        this.animating = false
        this.draw()
    }
    
    draw() {
        this.context.fillStyle = BACKGROUND
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.walls.forEach(wall => wall.draw(this.context))

        this.context.strokeStyle = SPRING    
        this.context.fillStyle = SPRING        
        
       this.objects.forEach((object) => {    
            object.springs.forEach(spring => spring.draw(this.context))
            object.masses.forEach(mass => mass.draw(this.context))
        })
    }

    update(deltaT) {
        this.objects.forEach((object) => {
            object.springs.forEach(spring => spring.applyForce())
            object.masses.forEach(mass => mass.applyForce(gravity.scale(mass.mass)))
            object.masses.forEach(mass => mass.update(deltaT))
            this.walls.forEach((wall) => {
                object.masses.forEach(mass => {
                    wall.intersect(mass)
                })
            })        
        })   
    }
    animate() {
        if (this.animationRequest)
            window.cancelAnimationFrame(this.animationRequest)
        this.animating = true

        this.draw()
        const UPDATES = 50
        const deltaT = .01
        for (let i = 0; i < UPDATES; ++i) {
            this.update(deltaT / UPDATES)
        }
        this.animationRequest = requestAnimationFrame(() => this.animate());
    }

}