import { Rol } from "./rol";
import { Provincia } from "./provincia";
import { Departamento } from "./departamento";
import { Localidad } from "./localidad";

export class Usuario {
  id: number;
  rol_id: number;
  rol:Rol;
  name: string;//usado solo para recibir data de gmail
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  provincia_id:number;
  departamento_id:number;
  localidad_id:number;
  provincia:Provincia;
  departamento:Departamento;
  localidad:Localidad;
  domicilio:string;
  celular:string;
  habilitado:boolean;
  en_espera:boolean;
  acceso_promos:boolean;
  constructor(data?:any){
    Object.assign(this, data);
  }


}
