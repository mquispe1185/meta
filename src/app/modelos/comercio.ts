import { TipoServicio } from './tipo-servicio';
import { Provincia } from "./provincia";

import { Departamento } from "./departamento";

import { Localidad } from "./localidad";
import { Usuario } from "./usuario";
import { Rubro } from "./rubro";

export class Comercio {

  public static DEFAULT:string = "default";
  public static PENDIENTE:string = "cambio_pendiente";

    id: number;
    nombre:string; //para comerciantes
    name:string; //para usuarios que dejan opiniones
    domicilio:string;
    telefono:string;
    celular:string;
    web:string;
    facebook:string;
    instagram:string;
    facebook_id:string;
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
    habilitado:boolean;
    envio:boolean;
    tipo_servicio_id:number;
    tipo_servicio:TipoServicio;
    estado:string; //0:DEFAULT 1:CON CAMBIO DE PLAN PENDIENTE
    es_fanpage:boolean;
    visitas_face:number;
    visitas_ig:number;
    visitas_web:number;
    visitas_wsp:number;
    visitas:number;
    created_at:string;
    plan_hasta:string; //Utilizado para mostrar fecha de Vto en vista Comerciante.
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }
