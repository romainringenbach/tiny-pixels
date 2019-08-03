
import {MatricesStack} from "./matrices_stack";
import {Node} from "./node";
import {Program} from "./program";
import {Mat4} from "./maths";

export class Engine {

    _programs : { [id: string] : Program; };
    _matrices_stack : MatricesStack;
    _gl_ctx : any;
    _current_scene : Node | null;
    _last_call : number


    constructor(canvas : any){
      this._programs = {};
      this._matrices_stack = new MatricesStack();
      this._gl_ctx = canvas.getContext("webgl");
      this._current_scene = null;
      this._last_call = -1;
    }

    addProgram(name: string,vertex_source: string,fragment_source: string){
      this._programs[name] = new Program(vertex_source,fragment_source);
      this._programs[name]._create(this._gl_ctx);
    }

    launchScene(scene : Node){
      this._current_scene = scene;
    }

    _nodes_draw(node : Node,delta : number){
      let child_names = node.childs.keys();
      node.process(delta);
      this._matrices_stack.apply(node.transform);
      for (var name in child_names) {
        this._nodes_draw(node.childs[name],delta);
      }
      this._matrices_stack.pop();
    }

    _draw(){
      if (this._current_scene != null) {
          let delta = 0;
          if (this._last_call == -1) {
              this._last_call == Date.now();
          } else {
              let now = Date.now();
              delta = now - this._last_call;
              this._last_call == now;
          }
          this._matrices_stack._push(Mat4.orthographic(0, this._gl_ctx.canvas.width, this._gl_ctx.canvas.height, 0, -1, 1));
          this._nodes_draw(this._current_scene,delta);
      }
    }

    run(){
      let engine = this;
      window.requestAnimationFrame(engine._draw);
    }
}
