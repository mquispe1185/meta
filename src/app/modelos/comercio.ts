import { Provincia } from "./provincia";

import { Departamento } from "./departamento";

import { Localidad } from "./localidad";
import { Usuario } from "./usuario";
import { Rubro } from "./rubro";

export class Comercio {
    
    id: number;
    nombre: string;
    domicilio:string;
    telefono:string;
    celular:string;
    web:string;
    facebook:string;
    instagram:string;
    twitter:string;
    latitud:string;
    longitud:string;
    email:string;
    provincia_id:number;
    departamento_id:number;
    localidad_id:number;
    provincia:Provincia;
    departamento:Departamento;
    localidad:Localidad;
    descripcion:string;
    usuario:Usuario;
    usuario_id:number;
    entrega:boolean;
    rubro:Rubro;
    rubro_id:number;
    horarios:any[];
    url_foto:string;
    tags:string;
  
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }