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
    horario_desde:string;
    horario_hasta:string;
    horario_desde2:string;
    horario_hasta2:string;
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

    constructor(data?: any) {
      Object.assign(this, data);
    }
  }