import {Mat4} from "./maths";
import {Transform} from "./transform";

export class MatricesStack {

    private stack : number[][];
    private cursor : number[];

    public constructor(){
      this.stack = [];
      this.cursor = [];
      this.pop();
    }

    public pop(){
      this.stack.pop();
      if (this.stack.length < 1) {
          this.stack.push(Mat4.identity());
          this.cursor = Mat4.identity()
      }
    }

    public push(matrix : number[]){
      this.stack.push(matrix);
      this.cursor = matrix.slice();
    }

    public apply(transform : Transform){
      this.translate(transform.translation_x,transform.translation_y,transform.z_index);
      this.rotate(transform.rotation);
      this.scale(transform.scale_x,transform.scale_y);
      this.push(this.cursor);
    }

    private translate(tx : number,ty : number, tz : number){
      Mat4.mul(this.cursor,Mat4.translation(tx,ty,tz));
    }

    private rotate(r:number){
      Mat4.mul(this.cursor,Mat4.rotation(r));
    }

    private scale(sx : number,sy : number){
      Mat4.mul(this.cursor,Mat4.scale(sx,sy));
    }


}
