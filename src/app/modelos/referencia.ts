import { Comercio } from './comercio';
import { Usuario } from './usuario';
export class Referencia {

    id: number;
    cuerpo: string;
    created_at:string;
    usuario:Usuario;
    usuario_id:number;
    puntaje:number;
    activo:boolean;
    comercio_id:number;
    comercio:Comercio;

    constructor(data?: any) {
      Object.assign(this, data);
    }
  }
