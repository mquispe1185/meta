import { Usuario } from './usuario';
import { Comercio } from './comercio';
import { Formapago } from './formapago';
export class Promocion {

  //PRECIOS PARA LAS PROMO SEGUN PLAN
  static GRATUITO:number = 0;
  static BASICO:number = 0;
  static ESTANDAR:number = 0;
  static PREMIUM:number = 0;

  //estado: 0:pendiente, 1:aprobado, 2:gratuito
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
    estado:string;
    formapago_id:number;
    formapago:Formapago;
    importe:number;
    costo_diario:number;
    descuento:number;
    codigo:string;
    url:string;
    vistas:number;
    constructor(data?: any) {
      Object.assign(this, data);
    }

  totalCosto(plan){
    switch(plan) {
      case 1: {
        this.costo_diario = Promocion.GRATUITO;
         return this.duracion * Promocion.GRATUITO;

      }
      case 2: {
        this.costo_diario = Promocion.BASICO;
        return this.duracion * Promocion.BASICO;

      }
      case 3: {
        this.costo_diario = Promocion.ESTANDAR;
        return this.duracion * Promocion.ESTANDAR;

     }
     case 4: {
      this.costo_diario = Promocion.PREMIUM;
      return this.duracion * Promocion.PREMIUM;

     }
   }
  }
  }
