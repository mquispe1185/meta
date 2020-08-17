export class Rol {
  static ADMIN:number = 1;
  static JEFE:number = 2;
  static SECRE:number = 3;
  static JUNTA:number = 4;
  
  id: number;
  descripcion: string;

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
