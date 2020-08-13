import { Usuario } from './usuario';
export class Referencia {
    
    id: number;
    cuerpo: string;
    created_at:string;
    usuario:Usuario;
    usuario_id:number;
    puntaje:number;
    activo:boolean;
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }