export class Transform {
  translation_x : number;
  translation_y : number;
  rotation : number;
  scale_x : number;
  scale_y : number;
  z_index : number;

  constructor(translation_x = 0.0,translation_y = 0.0,rotation = 0.0,scale_x = 1.0,scale_y = 1.0, z_index = 0.0){
    this.translation_x   = translation_x;
    this.translation_y   = translation_y;
    this.rotation   = rotation;
    this.scale_x  = scale_x;
    this.scale_y  = scale_y;
    this.z_index = z_index;
  }
}
