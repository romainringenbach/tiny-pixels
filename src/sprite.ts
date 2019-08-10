import {Node2D} from "./node";
import {BasicTextureShader} from "./program";

export class Sprite extends Node2D {

  sprite:object


  constructor(sprite:object,  ){
    super();
  }

  ready(engine:Engine){
    if (!engine.programExist("BasicTextureShader")) {
        engine.addProgram("BasicTextureShader",new BasicTextureShader());
    }
  }

  draw(gl:any,engine:Engine,delta:number){
    gl.bindTexture(gl.TEXTURE_2D, this.sprite);

    // Tell WebGL to use our shader program pair
    gl.useProgram("BasicTextureShader");

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set the matrix.
    

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
