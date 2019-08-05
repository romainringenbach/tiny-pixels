export class Program {

  private vsrc : string;
  private fsrc : string;
  private vsh : any;
  private fsh : any;
  private p : any;

  public constructor(vertex_source : string, fragment_source : string){
    this.vsrc =    vertex_source;
    this.fsrc =  fragment_source;
  }

  private createShader(gl : any, type : any, source:string){
    let shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
      return null
    }
  }

  public create(gl : any){
    this.vsh = this.createShader(gl, gl.VERTEX_SHADER,this.vsrc)
    this.vsh = this.createShader(gl, gl.FRAGMENT_SHADER,this.fsrc)
    this.p = gl.createProgram();
    gl.attachShader(this.p, this.vsh);
    gl.attachShader(this.p, this.fsh);
    gl.linkProgram(this.p)
    let success = gl.getProgramParameter(this.p, gl.LINK_STATUS);
    if (success) {
      return;
    }

    console.log(gl.getProgramInfoLog(this.p));
    gl.deleteProgram(this.p);

  }
}

export class Quad {
    public constructor(){

      let vertex_source = "                               \
        attribute vec4 a_position;                        \
        attribute vec2 a_texCoord;                        \
                                                          \
        varying vec2 v_texCoord;                          \
        uniform mat4 u_vm                                 \
        void main() {                                     \
          gl_Position = u_vm* vect4(a_position,1.0,1.0);  \
          v_texCoord = a_texCoord;                        \
        }                                                 \
       ";
      let fragment_source = "                             \
        precision mediump float;                          \
        uniform sampler2D u_image;                        \
        varying vec2 v_texCoord;                          \
        void main() {                                     \
          gl_FragColor = texture2D(u_image, v_texCoord);  \
        }                                                 \
      ";

      super(vertex_source,fragment_source);
    }
}
