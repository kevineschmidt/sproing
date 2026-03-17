class Mass {
    constructor(mass, x, y, color) {
        this.force = new Vector()
        this.velocity = new Vector()
        this.position = new Vector(x, y)
        this.mass = mass
        this.radius = mass * 2
        this.restitution = .8
        this.color = color
    }

    applyForce(f) {
        this.force = this.force.add(f)
    }
    
    update(dt) {
        this.velocity = this.velocity.add(this.force.scale(dt / this.mass))
        this.force = new Vector()
        this.position = this.position.add(this.velocity.scale(dt))
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.moveTo(this.position.x, this.position.y)
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 360)
        ctx.fill()
    }

}

class Spring { 
    constructor(mass1, mass2, k, length) {
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

    draw(ctx) {
        ctx.strokeStyle = "red"
        ctx.beginPath()
        ctx.moveTo(this.mass1.position.x, this.mass1.position.y)
        ctx.lineTo(this.mass2.position.x, this.mass2.position.y)
        ctx.stroke()
    }
}