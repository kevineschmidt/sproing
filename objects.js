

function createTallRect(x, y, cellSize, cells) {
    let masses = [new Mass(2, x, y, "red"), 
        new Mass(2, x + cellSize, y, "red")
    ]

    let springs = [new Spring(masses[0], masses[1], 4000, cellSize)];
    const diagonalSpringSize = Math.sqrt(cellSize * cellSize * 2)

    for (let i = 1; i < cells; ++i) {
        let mass1 = masses[masses.length - 2]
        let mass2 = masses[masses.length - 1]

        let massA = new Mass(2, x,            y+cellSize*i, "red")
        let massB = new Mass(2, x + cellSize, y+cellSize*i, "red")
        masses.push(massA)
        masses.push(massB)
         springs.push(new Spring(mass1, massA, 40000, cellSize))
         springs.push(new Spring(mass2, massB, 40000, cellSize))
         springs.push(new Spring(massA, massB, 40000, cellSize))
         springs.push(new Spring(mass1, massB, 40000, diagonalSpringSize))
         springs.push(new Spring(mass2, massA, 40000, diagonalSpringSize))          
    }

    return {
        springs,
        masses
    }
}

function buildCube() {
    const center = [ 400, 50 ]
    const dim = [ 20, 20 ]
    
    let mass1 = new Mass(2, center[0] - dim[0] / 2, center[1] - dim[1]/2, "red")
    let mass2 = new Mass(2, center[0] - dim[0] / 2, center[1] + dim[1]/2, "green")
    let mass3 = new Mass(2, center[0] + dim[0] / 2, center[1] + dim[1]/2, "blue")
    let mass4 = new Mass(2, center[0] + dim[0] / 2, center[1] - dim[1]/2, "yellow")

    return {
        masses: [mass1, mass2, mass3, mass4],
        springs: [
            new Spring(mass1, mass2, 4000, dim[1]),
            new Spring(mass2, mass3, 4000, dim[0]),
            new Spring(mass3, mass4, 4000, dim[1]),
            new Spring(mass4, mass1, 4000, dim[0]),
            new Spring(mass4, mass2, 4000, Math.sqrt(2*dim[0]*dim[1])),
            new Spring(mass1, mass3, 4000, Math.sqrt(2*dim[0]*dim[1]))
        ]
    }
}