import Vector from './vector'

class Mass {
    force: Vector
    velocity: Vector
    position: Vector
    mass: number
    restitution: number
    radius: number
    color: string

    constructor(mass: number, x: number, y: number, color: string) {
        this.force = new Vector()
        this.velocity = new Vector()
        this.position = new Vector(x, y)
        this.mass = mass
        this.radius = mass
        this.restitution = .8
        this.color = color
    }

    applyForce(f: Vector) {
        this.force = this.force.add(f)
    }
    
    update(dt: number) {
        this.velocity = this.velocity.add(this.force.scale(dt / this.mass))
        this.force = new Vector()
        this.position = this.position.add(this.velocity.scale(dt))
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.moveTo(this.position.x, this.position.y)
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 360)
        ctx.fill()
    }

}

class Spring { 
    mass1: Mass
    mass2: Mass
    k: number
    length: number
    damping: number

    constructor(mass1: Mass, mass2: Mass, k: number, length: number) {
        this.mass1 = mass1
        this.mass2 = mass2
        this.k = k
        this.damping = 20
        this.length = length
    }

    applyForce() {
        let dir = this.mass2.position.sub(this.mass1.position)
        const dirLen = dir.length()
        const springForce = (dirLen - this.length) * this.k
        
        const dirNorm = dir.scale(1/dirLen)
        const dampingForce = dirNorm.dot(this.mass2.velocity.sub(this.mass1.velocity))*this.damping

        const totalForce = springForce + dampingForce
        this.mass1.applyForce(dirNorm.scale(totalForce))
        this.mass2.applyForce(dirNorm.scale(-1*totalForce))
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "red"
        ctx.beginPath()
        ctx.moveTo(this.mass1.position.x, this.mass1.position.y)
        ctx.lineTo(this.mass2.position.x, this.mass2.position.y)
        ctx.stroke()
    }
}

class Body {
    springs: Array<Spring>
    masses: Array<Mass>
    
    constructor(springs:Array<Spring> = [], masses: Array<Mass> = []) {
        this.springs = springs
        this.masses = masses
    }
}

export { 
    Body,
    Spring,
    Mass
}