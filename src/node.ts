import {Transform} from "./transform";

export class Node {

  transform : Transform;
  childs : any
  parent : Node | null;

  constructor(name : string, parent : Node | null){

    this.transform = new Transform();
    this.childs = {};
    this.parent = parent;
    if (this.parent != null) {
        this.parent.childs[name] = this
    }
  }

  process(delta : number){

  }

}
