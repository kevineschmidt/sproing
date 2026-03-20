

import { Body, Spring, Mass } from './body'
export function createTallRect(x: number, y: number, cellSize: number, cells: number): Body {
    let masses: Array<Mass> = [
        new Mass(2, x, y, "red"), 
        new Mass(2, x + cellSize, y, "red")
    ]

    let springs = [new Spring(masses[0] as Mass, masses[1] as Mass, 4000, cellSize)];
    const diagonalSpringSize = Math.sqrt(cellSize * cellSize * 2)

    for (let i = 1; i < cells; ++i) {
        let mass1 = masses[masses.length - 2] as Mass
        let mass2 = masses[masses.length - 1] as Mass

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

    return new Body(
        springs,
        masses
    )
}
