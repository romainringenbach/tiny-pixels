import {Program} from "./program";
import {Transform} from "./transform";

export interface Engine {
  addProgram(name: string,program:Program):void;
  programExist(name:string) : boolean;
  useProgram(name:string):void;

  launchNodeAsScene(name:string):void;

  stackApply(transform:Transform):void;
  stackPop():void;
}
