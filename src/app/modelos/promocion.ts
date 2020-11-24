import { Usuario } from './usuario';
import { Comercio } from './comercio';
import { Formapago } from './formapago';
export class Promocion {

  static GRATUITO:number = 80;
  static BASICO:number = 70;
  static ESTANDAR:number = 60;
  static PREMIUM:number = 50;

  //estado: 0:default/pendiente, 1:habilitado, 2:nohabilitado
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
    importe:number;
    costo_diario:number;
    descuento:number;
    codigo:string;
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
