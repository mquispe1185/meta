import { Usuario } from './usuario';
import { Comercio } from './comercio';
import { Formapago } from './formapago';
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
    formapago_id:number;
    formapago:Formapago;
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }