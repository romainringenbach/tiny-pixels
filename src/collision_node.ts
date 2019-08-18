import {Node} from "./node";

export enum ShapeType {
  AABB = "AABB",
  Circle = "Circle"
}

export interface Shape {
    public static readonly type:ShapeType
}

export class AABB implements Shape {
  public static readonly type:ShapeType = ShapeType.AABB;
  private _w;
  private _h;

  public constructor(width:number,height:number){
    this.width = width;
    this.height = height;
  }

  get width():number {
    return _w;
  }

  set width(width:number):void {
    if (width > 0) {
        this._w = width;
    } else {
      throw new Error("Setting width failled, the value need to be > 0");
    }
  }

  get height():number {
    return _h;
  }

  set height(height:number):void {
    if (height > 0) {
        this._h = height;
    } else {
      throw new Error("Setting height failled, the value need to be > 0");
    }
  }
}

export class Circle implements Shape {
  public static readonly type:ShapeType = ShapeType.Circle;
  private _r;

  public constructor(rayon:number){
    this.rayon = rayon;
  }

  get rayon():number {
    return _r;
  }

  set rayon(rayon:number):void {
    if (rayon > 0) {
        this._r = rayon;
    } else {
      throw new Error("Setting rayon failled, the value need to be > 0");
    }
  }
}

export class CollisionShape extends Node  {
  public shape : Shape;


  public isColliding(collision_shape:CollisionShape):boolean {
    return true;
  }
  public isOnShape(x:number,y:number):boolean {
    let t = this.getGlobalTransform();

    if (this.shape.type == ShapeType.Circle) {
      let s = (this.shape as Circle);
      let xx = t.translation_x+s.rayon - x;
      let yy = t.translation_y+s.rayon - y;
      let d = Math.sqrt((xx)*(xx) + (yy)*(yy))

      return (d <= s.rayon);

    } else if(this.shape.type == ShapeType.AABB) {
      let s = (this.shape as AABB);

      return (x >= t.translation_x && x < t.translation_x + s.width && x >= t.translation_y && y < t.translation_y + s.height)
    }

    return false;
  }

}

export class CollisionNode extends Node {

}
