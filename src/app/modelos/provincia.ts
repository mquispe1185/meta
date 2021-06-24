export class Provincia {
    static SALTA = 18;
    
    id: number;
    nombre: string;
  
    constructor(data?: any) {
      Object.assign(this, data);
    }
  }