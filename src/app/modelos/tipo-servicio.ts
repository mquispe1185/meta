export class TipoServicio {
    id:number;
    nombre:string;
    descripcion:string;
    importe:number;
    
    constructor(data?: any) {
      Object.assign(this, data);
    }
}