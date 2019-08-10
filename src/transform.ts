export class Transform {
  public translation_x : number;
  public translation_y : number;
  public rotation : number;
  public scale_x : number;
  public scale_y : number;
  public z_index : number;

  public constructor(translation_x = 0.0,translation_y = 0.0,rotation = 0.0,scale_x = 1.0,scale_y = 1.0, z_index = 0.0){
    this.translation_x   = translation_x;
    this.translation_y   = translation_y;
    this.rotation   = rotation;
    this.scale_x  = scale_x;
    this.scale_y  = scale_y;
    this.z_index = z_index;
  }

  public clone() : Transform{
    return new Transform(
      this.translation_x,
      this.translation_y,
      this.rotatio,
      this.scale_x,
      this.scale_y,
      this.z_index
    )
  }
}
