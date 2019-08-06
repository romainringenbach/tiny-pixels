export interface Engine {
  public addProgram(name: string,program:Program);
  public setCurrentProgram(name:string);
  public launchScene(name:string);
}
