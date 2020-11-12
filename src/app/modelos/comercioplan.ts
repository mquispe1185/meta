import { Comercio } from './comercio';
export class Comercioplan {
    
    id: number;
    comercio_id:number;
    comercio:Comercio;
    tipo_servicio:number;
    desde:string;
    hasta:string;
    estado:number;// 0: pediente, 1:aprobado, 2: vencido

    constructor(data?: any) {
      Object.assign(this, data);
    }


    getTipoServicio(){
        switch(this.tipo_servicio) { 
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