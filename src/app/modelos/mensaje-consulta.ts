export class MensajeConsulta {
  nombre: string;
  email:string;
  telefono:string;
  consulta:string;
  constructor(data?: any) {
    Object.assign(this, data);
  }
}
