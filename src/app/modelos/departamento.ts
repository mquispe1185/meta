export class Departamento {
    
    id: number;
    nombre: string;
    provincia_id:number;
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }