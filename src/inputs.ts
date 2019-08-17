import {DictionnaryErrorType,DictionnaryError} from "./error";

export class Inputs {

  private actions : { [id: string] : boolean; };
  protected readonly canvas: HTMLCanvasElement;

  public constructor(canvas: HTMLCanvasElement){
    this.actions = {};
    this.canvas = canvas;
  }
  public isActionPressed(action:string) : boolean{
    if (this.actions[action] != undefined) {
        return this.actions[action];
    } else {
      throw new DictionnaryError("Getting action of name: "+action+" failed",DictionnaryErrorType.NotPresent);
    }
  }
  protected registerAction(action:string) : void{
    if (this.actions[action] === undefined) {
        this.actions[action] = false;
    } else {
      throw new DictionnaryError("Registering action of name: "+action+" failed",DictionnaryErrorType.AlreadyPresent);
    }
  }
  protected setAction(action:string,value:boolean) : void{
    if (this.actions[action] != undefined) {
        this.actions[action] = value;
    } else {
      throw new DictionnaryError("Setting action of name: "+action+" failed",DictionnaryErrorType.NotPresent);
    }
  }
}
