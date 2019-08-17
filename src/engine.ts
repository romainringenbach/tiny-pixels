import {Program} from "./program";
import {Transform} from "./transform";

export interface Engine {
  addProgram(name: string,program:Program):void;
  programExist(name:string) : boolean;
  useProgram(name:string):void;
  getAttributeLocation(name:string) : any;
  getUniformLocation(name:string) : any;

  launchNodeAsScene(name:string):void;
  getCurrentScene():string;

  stackApply(transform:Transform):void;
  stackPop():void;


}
