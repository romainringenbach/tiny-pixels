import {Mat4} from "./maths";
import {Transform} from "./transform";
import {Engine} from "./engine";
import {Node} from "./node";

export class Camera {
    public projection_matrix : number[];
    public view_matrix : number[];
    public transform : Transform;

    private nodeToFollow : number;

    public constructor(){
      this.transform = new Transform();
      this.projection_matrix = [];
      this.view_matrix = [];
      this.nodeToFollow = 0;
    }

    public ready(gl:any,engine:Engine){
      this.projection_matrix = Mat4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    }

    public process(gl:any,engine:Engine){

      if (this.nodeToFollow != 0) {
        this.transform = Node.getNodeById(this.nodeToFollow).getGlobalTransform();
      }

      this.view_matrix = Mat4.translation(-this.transform.translation_x,-this.transform.translation_y,-this.transform.z_index)
      Mat4.mul(this.view_matrix,Mat4.rotation(-this.transform.rotation));
      Mat4.mul(this.view_matrix,Mat4.scale(-this.transform.scale_x,-this.transform.scale_y));
    }

    public followNode(node:Node) {
      this.nodeToFollow = node.id;
    }


    public stopFollowNode() {
      this.nodeToFollow = 0;
    }
}
