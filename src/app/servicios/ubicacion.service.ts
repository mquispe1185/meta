import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from '../modelos/provincia';
import { Departamento } from '../modelos/departamento';
import { Localidad } from '../modelos/localidad';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  
  API_URL = `${environment.API_URL}/provincias`;

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<Provincia[]>{
    return this.http.get<Provincia[]>(this.API_URL);
  }

  getDptos(prov_id: number):  Observable<Departamento[]>{
    const url = `${environment.API_URL}/departamentos?provincia_id=${prov_id}`;
    return this.http.get<Departamento[]>(url);
  }

  getLocalidad(dto_id: number):  Observable<Localidad[]>{
    const url = `${environment.API_URL}/localidades?departamento_id=${dto_id}`;
    return this.http.get<Localidad[]>(url);
  }


}
