class User {
  constructor(nome,perfil){
    this._nome = nome;
    this._perfil = perfil;
  }
  get name(){
    return this._nome;
  }
  get perfil(){
    return this._pefil;
  }
  set name(nome){
    this._nome = nome;
  }
  set perfil(perfil){
    this._perfil = perfil;
  }
}
