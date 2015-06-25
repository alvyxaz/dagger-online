/**
 * Created by Alvys on 2015-06-22.
 */

class Position {
    private pos : Array<number>;

    constructor(x: number, y : number) {
        this.pos = [x, y];
    }

    get x() : number {return this.pos[0]; }
    set x(x: number)  {this.pos[0] = x;}

    get y() : number {return this.pos[1]; }
    set y(y: number)  {this.pos[1] = y;}

    public set(x : number, y : number) {
        this.pos[0] = x;
        this.pos[1] = y;
    }

    public distanceTo(target: Position) : number {
        var pos = this.pos;
        return Math.sqrt(this.sqrDistanceTo(target));
    }

    public sqrDistanceTo(target: Position) : number {
        return (target.x - this.x) * (target.x - this.x) + (target.y - this.y) * (target.y - this.y);
    }

    public offsetByAngle(angle: number, offset: number) {
        this.x += Math.cos(angle) * offset;
        this.y += Math.sin(angle) * offset;
    }
}

export = Position;