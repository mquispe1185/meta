import { Rol } from "./rol";
import { Provincia } from "./provincia";
import { Departamento } from "./departamento";
import { Localidad } from "./localidad";

export class Usuario {
  id: number;
  rol_id: number;
  rol:Rol;
  //login: string;
 // nickname: string;
  name: string;//usado solo para recibir data de gmail
  nombre: string;
  dni: string;
  //sexo: number;
  //fechanac: string;
  telefono: string;
  email: string;
  provincia_id:number;
  departamento_id:number;
  localidad_id:number;
  //password: string;
  //password_confirmation: string;
  provincia:Provincia;
  departamento:Departamento;
  localidad:Localidad;
  domicilio:string;
  celular:string;
  habilitado:boolean;
  en_espera:boolean;
  constructor(data?:any){
    Object.assign(this, data);
  }


}
