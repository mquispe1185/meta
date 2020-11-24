export class Rol {
  static ADMIN:number = 1;
  static COMERCIANTE:number = 2;
  static VISITANTE:number = 3;


  id: number;
  descripcion: string;

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
