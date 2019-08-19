import {Node} from "./node";
import {AcceleratingStructure} from "./accelerating_structure";
import {Engine} from "./engine";
import {Rect} from "./maths";
import {Transform} from "./transform";

export enum ShapeType {
  AABB = "AABB",
  Circle = "Circle"
}

export interface Shape {
  readonly type:ShapeType
  getBoundingRect():Rect;
}

export class AABB implements Shape {
  public readonly type:ShapeType = ShapeType.AABB;
  private _w : number = 0;
  private _h : number = 0;

  public constructor(width:number,height:number){
    this.width = width;
    this.height = height;
  }

  public getBoundingRect():Rect{
    return new Rect(0,0,this._w,this._h);
  }

  get width():number {
    return this._w;
  }

  set width(width:number) {
    if (width > 0) {
        this._w = width;
    } else {
      throw new Error("Setting width failled, the value need to be > 0");
    }
  }

  get height():number {
    return this._h;
  }

  set height(height:number) {
    if (height > 0) {
        this._h = height;
    } else {
      throw new Error("Setting height failled, the value need to be > 0");
    }
  }
}

export class Circle implements Shape {
  public readonly type:ShapeType = ShapeType.Circle;
  private _r : number = 0;

  public constructor(rayon:number){
    this.rayon = rayon;
  }

  public getBoundingRect():Rect{
    return new Rect(0,0,2*this._r,2*this._r);
  }

  get rayon():number {
    return this._r;
  }

  set rayon(rayon:number){
    if (rayon > 0) {
        this._r = rayon;
    } else {
      throw new Error("Setting rayon failled, the value need to be > 0");
    }
  }
}

export class CollisionShape extends Node  {
  public shape : Shape;

  public constructor(shape:Shape){
    super();
    this.shape = shape;
  }

  public getBoundingRect():Rect{
    let t:Transform = this.getGlobalTransform();
    let r:Rect = this.shape.getBoundingRect();
    r.x = t.translation_x;
    r.y = t.translation_y;
    return r;
  }


  public isColliding(collision_shape:CollisionShape):boolean {
    return true;
  }
  public isOnShape(x:number,y:number):boolean {
    if (this.getBoundingRect().inRect(x,y)) {
      if (this.shape.type == ShapeType.Circle) {
        let s = (this.shape as Circle);
        let t = this.getGlobalTransform();
        let xx = t.translation_x+s.rayon - x;
        let yy = t.translation_y+s.rayon - y;
        let d = Math.sqrt((xx)*(xx) + (yy)*(yy))

        return (d <= s.rayon);

      } else if(this.shape.type == ShapeType.AABB) {
        return true;
      }
    }
    return false;
  }

}

export class Collision {
    public readonly node : number;

    constructor(collider:CollisionNode){
      this.node = collider.id;
    }

}

export class CollisionNode extends Node {
  public collision_shape: CollisionShape;
  public collision_mask : number;
  public collision_layer : number;
  public collisions : number[];

//s:collisionDetected : {collision:Collision}
//s:click : {}

  constructor(collision_shape:CollisionShape){
    super();
    this.collision_shape = collision_shape;
    this.collision_mask = 0;
    this.collision_layer = 0;
    this.collisions = [];

    this.signal("on_collision");
    this.signal("on_click");
  }

  protected _physics_process(engine:Engine,delta:number){
    this.collisions = [];

    super._physics_process(engine,delta);
    let possible_colliders = engine.acc_struct.getPossibleCollidingNodeFromNode(this);

    for (let pc in possible_colliders) {
        let possible_collider = (Node.getNodeById(Number(pc)) as CollisionNode);

        if ((this.collision_layer & possible_collider.collision_mask) != 0) {
          if (this.collision_shape.isColliding(possible_collider.collision_shape)) {
              this.collisions.push(possible_collider.id);
              this.emitSignal("on_collision",new Collision(possible_collider));
          }
        }
    }

  }


}
