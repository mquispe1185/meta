import { Formapago } from './../modelos/formapago';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { TipoServicio } from '../modelos/tipo-servicio';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  constructor(private http: HttpClient) { }

  getTipoServicios(): Observable<TipoServicio[]>{
    const url = `${environment.API_URL}/tipo_servicios`;
    return this.http.get<TipoServicio[]>(url);
  }

  getFormapagos(): Observable<Formapago[]>{
    const url = `${environment.API_URL}/formapagos`;
    return this.http.get<Formapago[]>(url);
  }
}
