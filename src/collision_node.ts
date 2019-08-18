import {Node} from "./node";
import {AcceleratingStructure} from "./accelerating_structure";
import {Engine} from "./engine"

export enum ShapeType {
  AABB = "AABB",
  Circle = "Circle"
}

export interface Shape {
  readonly type:ShapeType
}

export class AABB implements Shape {
  public readonly type:ShapeType = ShapeType.AABB;
  private _w : number = 0;
  private _h : number = 0;

  public constructor(width:number,height:number){
    this.width = width;
    this.height = height;
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

export class Collision {
    public readonly node : number;

    constructor(collider:CollisionNode){
      this.node = collider.id;
    }

}

export class CollisionNode extends Node {
  private collision_shape: CollisionShape;
  private collision_mask : number;
  private collision_layer : number;
  private collisions : number[];

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
