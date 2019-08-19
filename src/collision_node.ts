import {Node} from "./node";
import {AcceleratingStructure} from "./accelerating_structure";
import {Engine} from "./engine";
import {Rect,clamp,Vec2} from "./maths";
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

  public constructor(radius:number){
    this.radius = radius;
  }

  public getBoundingRect():Rect{
    return new Rect(0,0,2*this._r,2*this._r);
  }

  get radius():number {
    return this._r;
  }

  set radius(radius:number){
    if (radius > 0) {
        this._r = radius;
    } else {
      throw new Error("Setting radius failled, the value need to be > 0");
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
    let t1 = this.getGlobalTransform();
    let t2 = collision_shape.getGlobalTransform();
    if (this.shape.type == ShapeType.Circle && collision_shape.shape.type == ShapeType.Circle) {
      let s1 = (this.shape as Circle);
      let s2 = (collision_shape.shape as Circle);

      let xx = t1.translation_x+s1.radius - t2.translation_x+s2.radius;
      let yy = t1.translation_y+s1.radius - t2.translation_y+s2.radius;
      let d = Math.sqrt((xx)*(xx) + (yy)*(yy))

      return (d <= s1.radius + s2.radius);

    } else if(this.shape.type == ShapeType.AABB && collision_shape.shape.type == ShapeType.AABB) {
        let rect1:Rect = this.shape.getBoundingRect();
        rect1.x = t1.translation_x;
        rect1.y = t1.translation_y;

        let rect2:Rect = collision_shape.shape.getBoundingRect();
        rect2.x = t2.translation_x;
        rect2.y = t2.translation_y;


        return (rect1.x < rect2.x + rect2.w &&
         rect1.x + rect1.w > rect2.x &&
         rect1.y < rect2.y + rect2.h &&
         rect1.y + rect1.h > rect2.y)
    } else {
      let rect:Rect;
      let radius:number;
      let tr : Transform;
      let tc : Transform;

      if (this.shape.type == ShapeType.AABB) {
        rect = this.shape.getBoundingRect();
        tr = t1;
        radius = (collision_shape.shape as Circle).radius;
        tc = t2;
      } else {
        rect = collision_shape.shape.getBoundingRect();
        tr = t2;
        radius = (this.shape as Circle).radius;
        tc = t1;
      }

      rect.x = tr.translation_x;
      rect.y = tr.translation_y;
      let cCenter:Vec2 = new Vec2(tc.translation_x+radius,tc.translation_y+radius);
      let rCenter:Vec2 = rect.getCenter();
      let rExtends:Vec2 = new Vec2(rect.w/2,rect.h/2);
      let d = cCenter.sub(rCenter);
      let clamped:Vec2 = new Vec2(clamp(d.x,-rExtends.x,+rExtends.x),clamp(d.y,-rExtends.y,+rExtends.y));
      let closest:Vec2 = rCenter.add(clamped);
      d = closest.sub(cCenter);
      return d.length() < radius;



    }
  }
  public isOnShape(x:number,y:number):boolean {
    if (this.getBoundingRect().inRect(x,y)) {
      if (this.shape.type == ShapeType.Circle) {
        let s = (this.shape as Circle);
        let t = this.getGlobalTransform();
        let xx = t.translation_x+s.radius - x;
        let yy = t.translation_y+s.radius - y;
        let d = Math.sqrt((xx)*(xx) + (yy)*(yy))

        return (d <= s.radius);

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
