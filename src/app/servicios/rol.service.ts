import { Injectable } from '@angular/core';
import { Rol } from '../modelos/rol';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
// Variables

import { Origen } from '../modelos/origen';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolService {

  API_URL = `${environment.API_URL}/roles`;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Rol[]>{
    return this.http.get<Rol[]>(this.API_URL);
  }

  createRol(rol: Rol): Observable<any>{
    return this.http.post<Rol>(this.API_URL, rol);
  }

  updateRol(rol: Rol): Observable<any>{
    const url = `${this.API_URL}/${rol.id}`;
    return this.http.put(url, rol);
  }

  deleteRol(rol: Rol): Observable<any>{
    const url = `${this.API_URL}/${rol.id}`;
    return this.http.delete(url);
  }

  getOrigen(): Observable<Origen[]>{
    const url = `${environment.API_URL}/origenes`;
    return this.http.get<Origen[]>(url);
  }
}
