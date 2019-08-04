import {Mat4} from "./maths";
import {Transform} from "./transform";

export class MatricesStack {

    private _stack : number[][];
    private _cursor : number[];

    public constructor(){
      this._stack = [];
      this._cursor = [];
      this.pop();
    }

    public pop(){
      this._stack.pop();
      if (this._stack.length < 1) {
          this._stack.push(Mat4.identity());
          this._cursor = Mat4.identity()
      }
    }

    public push(matrix : number[]){
      this._stack.push(matrix);
      this._cursor = matrix.slice();
    }

    public apply(transform : Transform){
      this.translate(transform.translation_x,transform.translation_y,transform.z_index);
      this.rotate(transform.rotation);
      this.scale(transform.scale_x,transform.scale_y);
      this.push(this._cursor);
    }

    private translate(tx : number,ty : number, tz : number){
      Mat4.mul(this._cursor,Mat4.translation(tx,ty,tz));
    }

    private rotate(r:number){
      Mat4.mul(this._cursor,Mat4.rotation(r));
    }

    private scale(sx : number,sy : number){
      Mat4.mul(this._cursor,Mat4.scale(sx,sy));
    }


}
