export enum DictionnaryErrorType {
  NotPresent = "NotPresent",
  AlreadyPresent = "AlreadyPresent"
}

export class DictionnaryError extends Error {
    public readonly error_type : DictionnaryErrorType
    public constructor(message:string,error_type:DictionnaryErrorType){
      super(message);
      this.error_type = error_type
      this.name = "DictionnaryError."+this.error_type;
    }
}



export enum ProgramErrorType {
  AttributDontExist = "AttributDontExist",
  UniformDontExist = "AttributDontExist",
  ShaderCompilationFailed = "ShaderCompilationFailed",
  LinkingProgramFailed = "LinkingProgramFailed"
}

export class ProgramError extends Error {
    public readonly error_type : ProgramErrorType
    public constructor(message:string,error_type:ProgramErrorType){
      super(message);
      this.error_type = error_type
      this.name = "ProgramError."+this.error_type;
    }
}
