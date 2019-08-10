import {Mat4} from "./maths";
import {Transform} from "./transform";
import {Engine} from "./engine"

export class Camera {
    public projection_matrix : number[];
    public view_matrix : number[];
    public transform : Transform;

    public constructor(){
      this.transform = new Transform();
      this.projection_matrix = [];
      this.view_matrix = [];
    }

    public ready(gl:any,engine:Engine){
      this.projection_matrix = Mat4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    }

    public process(gl:any,engine:Engine){
      this.view_matrix = Mat4.translation(-this.transform.translation_x,-this.transform.translation_y,-this.transform.z_index)
      Mat4.mul(this.view_matrix,Mat4.rotation(-this.transform.rotation));
      Mat4.mul(this.view_matrix,Mat4.scale(-this.transform.scale_x,-this.transform.scale_y));
    }
}
