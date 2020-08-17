export class Localidad {
    
    id: number;
    nombre: string;
    provincia_id:number;
    departamento_id:number;
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }