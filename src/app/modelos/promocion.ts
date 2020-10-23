import { Usuario } from './usuario';
import { Comercio } from './comercio';
export class Promocion {
    
    id: number;
    comercio_id:number;
    comercio:Comercio;
    usuario_id:number;
    usuario:Usuario;
    desde:string;
    hasta:string;
    titulo:string;
    descripcion:string;
    duracion:number;
    vencido:boolean;
    prioridad:number;
    estado:number;

    constructor(data?: any) {
      Object.assign(this, data);
    }
  }