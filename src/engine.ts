import {Program} from "./program";
import {Transform} from "./transform";
import {Inputs} from "./inputs"
import {AcceleratingStructure} from "./accelerating_structure"

export interface Engine {

  readonly inputs : Inputs;
  readonly acc_struct : AcceleratingStructure;

  addProgram(name: string,program:Program):void;
  programExist(name:string) : boolean;
  useProgram(name:string):void;
  getAttributeLocation(name:string) : any;
  getUniformLocation(name:string) : any;

  launchNodeAsScene(name:string):void;
  getCurrentScene():string|null;

  stackApply(transform:Transform):void;
  stackPop():void;
}
