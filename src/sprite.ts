import {Node} from "./node";
import {BasicTextureShader} from "./program";
import {Engine} from "./engine"

function isPowerOf2(value : number) : boolean {
  return (value & (value - 1)) == 0;
}

export class Sprite extends Node {

  sprite:any;
  tex:any;

  private static positions : number[] = [
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
  ];

  private static tex_coords : number[] = [
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
  ];

  private static position_buffer : any = null;
  private static tex_coord_buffer : any = null;


  constructor(sprite:any){
    super();
    this.sprite = sprite;
  }

  ready(gl:any,engine:Engine){
    if (!engine.programExist("BasicTextureShader")) {
        engine.addProgram("BasicTextureShader",new BasicTextureShader());
    }

    if (Sprite.position_buffer == null && Sprite.tex_coord_buffer == null) {
      Sprite.position_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.position_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Sprite.positions), gl.STATIC_DRAW);

      Sprite.tex_coord_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.tex_coord_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Sprite.tex_coords), gl.STATIC_DRAW);
    }

    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.sprite);
    if (isPowerOf2(this.sprite.width) && isPowerOf2(this.sprite.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }


  }

  draw(gl:any,engine:Engine,delta:number){
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.position_buffer);
    gl.enableVertexAttribArray(engine.getAttributeLocation("a_position"));
    gl.vertexAttribPointer(engine.getAttributeLocation("a_position"), 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.tex_coord_buffer);
    gl.enableVertexAttribArray(engine.getAttributeLocation("a_texCoord"));
    gl.vertexAttribPointer(engine.getAttributeLocation("a_texCoord"), 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(engine.getUniformLocation("u_tex_location"), 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
