export class Program {

  private _vsrc : string;
  private _fsrc : string;
  private _vsh : any;
  private _fsh : any;
  private _p : any;

  public constructor(vertex_source : string, fragment_source : string){
    this._vsrc =    vertex_source;
    this._fsrc =  fragment_source;
    _create();
  }

  private _createShader(gl : any, type : any, source:string){
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

  private _create(gl : any){
    this._vsh = this._createShader(gl, gl.VERTEX_SHADER,this._vsrc)
    this._vsh = this._createShader(gl, gl.FRAGMENT_SHADER,this._fsrc)
    this._p = gl.createProgram();
    gl.attachShader(this._p, this._vsh);
    gl.attachShader(this._p, this._fsh);
    gl.linkProgram(this._p)
    let success = gl.getProgramParameter(this._p, gl.LINK_STATUS);
    if (success) {
      return;
    }

    console.log(gl.getProgramInfoLog(this._p));
    gl.deleteProgram(this._p);

  }
}
