import {ProgramErrorType,ProgramError} from "./error";

export class Program {

  private vsrc : string;
  private fsrc : string;
  private vsh : any;
  private fsh : any;
  private p : any;

  private u_model_matrix_location : any;
  private u_view_matrix_location : any;
  private u_projection_matrix_location : any;

  public constructor(vertex_source : string, fragment_source : string){
    this.vsrc =    vertex_source;
    this.fsrc =  fragment_source;

    this.u_model_matrix_location = null;
    this.u_view_matrix_location = null;
    this.u_projection_matrix_location = null;
  }

  private createShader(gl : any, type : any, source:string){
    let shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
      let typeN = "vertex";
      if (type == gl.FRAGMENT_SHADER) {
        typeN = "fragment";
      }
      throw new ProgramError("Compilation of "+typeN+" failed",ProgramErrorType.ShaderCompilationFailed);
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
      this.u_model_matrix_location = gl.getUniformLocation(this.p,"u_model_matrix");
      this.u_view_matrix_location = gl.getUniformLocation(this.p,"u_view_matrix");
      this.u_projection_matrix_location = gl.getUniformLocation(this.p,"u_projection_matrix");
    } else {
      console.log(gl.getProgramInfoLog(this.p));
      gl.deleteProgram(this.p);
      this.p = null;
      throw new ProgramError("Linking of program failed",ProgramErrorType.LinkingProgramFailed);
    }



  }

  public use(gl:any,projection_matrix:number[],view_matrix:number[],model_matrix:number[]){

    gl.useProgram(this.p);

    if (this.u_model_matrix_location != null) {
        gl.uniformMatrix4fv(this.u_model_matrix_location, false, model_matrix)
    }
    if (this.u_view_matrix_location != null) {
        gl.uniformMatrix4fv(this.u_view_matrix_location, false, view_matrix)
    }
    if (this.u_projection_matrix_location != null) {
        gl.uniformMatrix4fv(this.u_projection_matrix_location, false, projection_matrix)
    }

  }

  public getAttributeLocation(name:string) : any{
    throw new ProgramError("Getting attribut of name : "+name+" failed",ProgramErrorType.AttributDontExist);
  }

  public getUniformLocation(name:string) : any{
    throw new ProgramError("Getting uniform of name : "+name+" failed",ProgramErrorType.UniformDontExist);
  }

  protected _getAttributeLocation(gl:any,name:string) : any {
    return gl.getAttribLocation(this.p,name);
  }

  protected _getUniformLocation(gl:any,name:string) : any {
    return gl.getUniformLocation(this.p,name);
  }
}

export class BasicTextureShader extends Program {

    private a_position_location : any;
    private a_texCoord_location : any;
    private u_tex_location : any;

    public constructor(){

      let vertex_source = "                               \
        attribute vec4 a_position;                        \
        attribute vec2 a_texCoord;                        \
                                                          \
        varying vec2 v_texCoord;                          \
        uniform mat4 u_model_matrix                       \
        uniform mat4 u_view_matrix                        \
        uniform mat4 u_projection_matrix                  \
        void main() {                                     \
          gl_Position = u_vm* vect4(a_position,1.0,1.0);  \
          v_texCoord = a_texCoord;                        \
        }                                                 \
       ";
      let fragment_source = "                             \
        precision mediump float;                          \
        uniform sampler2D u_tex;                        \
        varying vec2 v_texCoord;                          \
        void main() {                                     \
          gl_FragColor = texture2D(u_tex, v_texCoord);  \
        }                                                 \
      ";

      super(vertex_source,fragment_source);
    }

    public create(gl : any){
      super.create(gl);
      this.a_position_location = this._getAttributeLocation(gl,"a_position");
      this.a_texCoord_location = this._getAttributeLocation(gl,"a_texCoord");
      this.u_tex_location = this._getUniformLocation(gl,"u_tex");
    }

    public getAttributeLocation(name:string) : any{
      if (name == "a_position") {
        return this.a_position_location;
      } else if (name == "a_texCoord"){
        return this.a_texCoord_location;
      } else {
        return super.getAttributeLocation(name);
      }
    }

    public getUniformLocation(name:string) : any{
      if (name == "u_tex") {
        return this.u_tex_location;
      } else {
        return super.getUniformLocation(name);
      }
    }


}
