/**
 * Robotic rovers by NASA.
 * Landing will be in x, y position and orientation (N, E, W, S).
 * In order to control a rover, NASA sends a simple string of letters.
 * The possible letters are 'L', 'R' and 'M'.
 * 'L' and 'R' makes the rover spin 90 degrees left or right respectively, without moving from its current spot.
 * 'M' means move forward one grid point, and maintain the same heading.
 */
 import Plateau from "./Plateau";
 import Point from "./Point";
 import Orientation from "./Orientation";
 import Instruction from "./Instruction";
 
 class Rover {
     name: string;
     position!: Point;
     orientation!: Orientation;
     landing: {
         position: Point,
         orientation: Orientation
     };
     instructions: string[];
     status: {
       previous: {
         orientation: Orientation,
         position: Point
       }
     };
 
     /**
      * Set rover name, data where to land, instructions how to navigate plateau
      *
      * @param name
      * @param landing
      * @param instructions
      */
     constructor(name: string,
                 landing: { position: Point, orientation: Orientation},
                 instructions: string[]) {
         this.name = name;
         this.landing = landing;
         this.instructions = instructions;
         this.status = { previous: { orientation: Orientation.N, position: null as any }};
     }
 
     landOn(plateau: Plateau): void {
         if (this.willFallFrom(plateau, this.landing.position)) {
             throw new Error(`${this.name} cannot land, will fall from plateau.`);
         }
 
         if (plateau.hasRoverAt(this.landing.position)) {
             throw new Error(`${this.name} cannot land, will collide with another rover.`);
         }
 
         this.position = this.landing.position;
         this.orientation = this.landing.orientation;
         plateau.rovers.push(this);
     }
 
     navigateOn(plateau: Plateau): String {
         if (!this.hasLanded()) {
             throw new Error(`${this.name} cannot execute instructions if it has not yet landed on a plateau.`);
         }
 
         // Update rover position based on instruction
         this.instructions.map((instruction) => {
          this.execute(instruction as Instruction, plateau)
         })
         return this.getStatus();
     }

     logHistory() {
       this.status = {
         previous: {
          orientation: this.orientation,
          position: this.position
         }
       }
     }

     execute(instruction: Instruction, plateau: Plateau) {
      this.logHistory();
      switch (instruction) {
        case Instruction.L:
            this.turnLeft();
            break;
        case Instruction.R:
            this.turnRight();
            break;
        case Instruction.M:
            this.move(plateau);
            break;
        default:
            break;
      }
     }
 
     turnLeft(): Orientation {
         switch (this.orientation) {
             case Orientation.N:
                 this.orientation = Orientation.W;
                 break;
             case Orientation.E:
                 this.orientation = Orientation.N;
                 break;
             case Orientation.W:
                 this.orientation = Orientation.S;
                 break;
             case Orientation.S:
                 this.orientation = Orientation.E;
                 break;
             default:
                 break;
         }
         return this.orientation;
     }
 
     turnRight(): Orientation {
         switch (this.orientation) {
             case Orientation.N:
                 this.orientation = Orientation.E;
                 break;
             case Orientation.E:
                 this.orientation = Orientation.S;
                 break;
             case Orientation.W:
                 this.orientation = Orientation.N;
                 break;
             case Orientation.S:
                 this.orientation = Orientation.W;
                 break;
             default:
                 break;
         }
         return this.orientation;
     }
 
     move(plateau:Plateau): Point {
         if (!this.hasLanded()) {
             throw new Error(`${this.name} cannot move if it has not yet landed on a plateau.`);
         }
 
         let newPosition = { ...this.position };
         switch (this.orientation) {
             case Orientation.N:
                 newPosition.y++;
                 break;
             case Orientation.E:
                 newPosition.x++;
                 break;
             case Orientation.S:
                 newPosition.y--;
                 break;
             case Orientation.W:
                 newPosition.x--;
                 break;
             default:
                 break;
         }
 
         if (this.willFallFrom(plateau, newPosition)) {
             throw new Error(`${this.name} can no longer move or it will fall from plateau.`);
         }
 
         if (plateau.hasRoverAt(newPosition)) {
             throw new Error(`${this.name} can no longer move or it will collide with another rover at x:${newPosition.x} y:${newPosition.y}.`);
         }
 
         this.position = newPosition;
         return this.position;
     }
 
     willFallFrom(plateau: Plateau, position: Point): boolean {
         return position.x < 0 ||
             position.x > plateau.width ||
             position.y < 0 ||
             position.y > plateau.height;
     }
 
     getStatus(): string {
         if (!this.hasLanded()) {
             return `${this.name} not yet landed.`;
         }
         return `${this.name} is at x:${this.position.x} y:${this.position.y} facing ${this.orientation}.`;
     }
 
     hasLanded(): boolean {
         return !!(this.position && this.orientation);
     }
 }

 export default Rover;