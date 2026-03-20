class Vector {
    x: number
    y: number
    
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    
    length() {
        return Math.sqrt(this.dot(this))
    }

    sub(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y)
    }

    add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y)
    }

    dot(v: Vector) {
        return this.x * v.x + this.y * v.y
    }
    
    scale(factor: number) {
        return new Vector(this.x * factor, this.y * factor)
    }

    normalize() {
        return this.scale(1.0/this.length())
    }
}

export default Vector