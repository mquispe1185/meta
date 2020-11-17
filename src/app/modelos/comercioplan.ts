import { Formapago } from './formapago';
import { Comercio } from './comercio';
import { TipoServicio } from './tipo-servicio';
import { Usuario } from './usuario';
export class Comercioplan {
    
    id: number;
    comercio_id:number;
    comercio:Comercio;
    tipo_servicio_id:number;
    tipo_servicio:TipoServicio;
    servicio_anterior_id:number;
    servicio_anterior:TipoServicio;
    desde:string;
    hasta:string;
    estado:number;// 0: pendiente, 1:aprobado, 2: vencido,3:rechazado
    formapago_id:number;
    formapago:Formapago;
    meses:number;
    importe:number;
    usuario_id:number;
    usuario:Usuario;
    constructor(data?: any) {
      Object.assign(this, data);
    }


    getTipoServicio(){
        switch(this.tipo_servicio_id) { 
          case 0: { 
             return 'GRATUITO'; 
            
          } 
          case 1: { 
             return 'BASICO'; 
            
          } 
          case 2: { 
            return 'ESTANDAR'; 
           
         } 
         case 3: { 
            return 'PREMIUM'; 
           
         } 
       } 
      }

    getEstado(){
        switch(this.estado) { 
            case 0: { 
               return 'PENDIENTE'; 
              
            } 
            case 1: { 
               return 'APROBADO'; 
              
            } 
            case 2: { 
              return 'VENCIDO'; 
             
           } 
        
         }   
    }

    getDiasRestantes(){
        let diff = Math.abs(new Date(this.hasta).getTime() - new Date().getTime());
        return Math.ceil(diff / (1000 * 3600 * 24)); 
    }
  }

  //clase que lleva el registro de camio de planes