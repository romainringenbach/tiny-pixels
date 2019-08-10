export interface Engine {
  public addProgram(name: string,program:Program);
  public programExist(name:string) : bool;
  public useProgram(name:string);

  public launchScene(name:string);
}
