export namespace Mat4 {

  export function orthographic(l:number,r:number,b:number,t:number,n:number,f:number) { // left, right, bottom, top, near, far
    return [
      2/(r-l)    , 0          , 0          , 0,
      0          , 2/(t-b)    , 0          , 0,
      0          , 0          , 2/(n-f)    , 0,
      (l+r)/(l-r), (b+t)/(b-t), (n+f)/(n-f), 1,
    ];
  }

  export function identity() {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];
  }

  export function translation(tx:number,ty:number,tz = 0.0) {
    return [
      1,    0,    0,   0,
      0,    1,    0,   0,
      0,    0,    1,   0,
      tx,    ty,    tz,   1
    ];
  }

  export function rotation(r:number,degree=true) {
      let rr = r;
      if (degree) {
          rr = r * (Math.PI/180.0);
      }

      return [
        Math.cos(rr), -Math.sin(rr),    0,    0,
        Math.sin(rr),  Math.cos(rr),    0,    0,
             0,       0,    1,    0,
             0,       0,    0,    1
      ];

  }

  export function scale(sx:number,sy:number,sz = 1.0) {
      return [
          sx,    0,    0,   0,
          0,    sy,    0,   0,
          0,    0,    sz,   0,
          0,    0,    0,   1
      ];
  }

  function _multiplyMatrixAndPoint(matrix:number[], point:number[]) {

    //Give a simple variable name to each part of the matrix, a column and row number
    var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
    var c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
    var c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
    var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

    //Now set some simple names for the point
    var x = point[0];
    var y = point[1];
    var z = point[2];
    var w = point[3];

    //Multiply the point against each part of the 1st column, then add together
    var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

    //Multiply the point against each part of the 2nd column, then add together
    var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

    //Multiply the point against each part of the 3rd column, then add together
    var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

    //Multiply the point against each part of the 4th column, then add together
    var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

    return [resultX, resultY, resultZ, resultW];
  }

  export function mul(matrixA:number[], matrixB:number[]) {

    // Slice the second matrix up into columns
    var column0 = [matrixB[0], matrixB[4], matrixB[8], matrixB[12]];
    var column1 = [matrixB[1], matrixB[5], matrixB[9], matrixB[13]];
    var column2 = [matrixB[2], matrixB[6], matrixB[10], matrixB[14]];
    var column3 = [matrixB[3], matrixB[7], matrixB[11], matrixB[15]];

    // Multiply each column by the matrix
    var result0 = _multiplyMatrixAndPoint(matrixA, column0);
    var result1 = _multiplyMatrixAndPoint(matrixA, column1);
    var result2 = _multiplyMatrixAndPoint(matrixA, column2);
    var result3 = _multiplyMatrixAndPoint(matrixA, column3);

    // Turn the result columns back into a single matrix
    return [
      result0[0], result1[0], result2[0], result3[0],
      result0[1], result1[1], result2[1], result3[1],
      result0[2], result1[2], result2[2], result3[2],
      result0[3], result1[3], result2[3], result3[3]
    ];
  }

}

export class Rect {
    public x:number = 0;
    public y:number = 0;
    private _w:number = 0;
    private _h:number = 0;

    public constructor(x:number,y:number,w:number,h:number){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    get w() : number {
      return this._w;
    }

    set w(w:number){
      if (w > 0) {
          this._w = w;
      } else {
        throw new Error("Setting w failled, the value need to be > 0");
      }
    }

    get h() : number {
      return this._h;
    }

    set h(h:number){
      if (h > 0) {
          this._h = h;
      } else {
        throw new Error("Setting h failled, the value need to be > 0");
      }
    }

    public inRect(x:number,y:number):boolean {
      return (x >= this.x && y >= this.x && x < this.x+this.w && y < this.y+this.y)
    }
}
