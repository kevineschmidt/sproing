class Wall {
    constructor(x1, x2, y1, y2) {
        this.start = new Vector(x1, y1)
        this.end = new Vector(x2, y2)

        this.vector = this.end.sub(this.start)
        this.length = this.vector.length()
        this.vector = this.vector.scale(1.0 / this.length)
        this.normal = new Vector(-this.vector.y, this.vector.x)
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.strokeStyle="white"
        ctx.moveTo(this.start.x, this.start.y)
        ctx.lineTo(this.end.x, this.end.y)
        ctx.stroke()
    }

    intersect(ball) {
        if (ball.position.x + ball.radius < this.start.x) return false
        if (ball.position.x - ball.radius > this.end.x)   return false
        
        const v = ball.position.sub(this.start)
        // Height from line
        const hdot = v.dot(this.normal)

        // Length along the line
        const ldot = v.dot(this.vector)


        // Intersect
        if (Math.abs(hdot) < ball.radius && ldot > 0 && ldot < this.length) {
            const vdot = ball.velocity.dot(this.normal)
            if (vdot < 0 && hdot < 0 || vdot > 0 && hdot > 0) return false

            // Rebound
            const deltaV = this.normal.scale(vdot).add(this.normal.scale(vdot * ball.restitution))
            ball.velocity = ball.velocity.sub(deltaV)

            // Friction
            const friction = this.vector.scale(.01 * ball.velocity.dot(this.vector))
            ball.velocity = ball.velocity.sub(friction)
            return true
        }

        return false
    }
}