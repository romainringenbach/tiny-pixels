import {Mat4} from "./maths";
import {Transform} from "./transform";

export class MatricesStack {

    _stack : number[][];
    _cursor : number[];

    constructor(){
      this._stack = [];
      this._cursor = [];
      this.pop();
    }

    pop(){
      this._stack.pop();
      if (this._stack.length < 1) {
          this._stack.push(Mat4.identity());
          this._cursor = Mat4.identity()
      }
    }

    _push(matrix : number[]){
      this._stack.push(matrix);
      this._cursor = matrix.slice();
    }

    apply(transform : Transform){
      this.translate(transform.translation_x,transform.translation_y,transform.z_index);
      this.rotate(transform.rotation);
      this.scale(transform.scale_x,transform.scale_y);
      this._push(this._cursor)

    }

    translate(tx : number,ty : number, tz : number){
      Mat4.mul(this._cursor,Mat4.translation(tx,ty,tz));
    }

    rotate(r:number){
      Mat4.mul(this._cursor,Mat4.rotation(r));
    }

    scale(sx : number,sy : number){
      Mat4.mul(this._cursor,Mat4.scale(sx,sy));
    }


}
