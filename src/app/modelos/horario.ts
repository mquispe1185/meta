import { Comercio } from './comercio';
export class Horario {
    
    id: number;
    dia:number;
    dia_nombre:string;
    desde: string;
    hasta: string;
    comercio_id:number;
    comercio:Comercio;
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }