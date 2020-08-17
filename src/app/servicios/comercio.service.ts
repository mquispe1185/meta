import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comercio } from '../modelos/comercio';

@Injectable({
  providedIn: 'root'
})
export class ComercioService {
  API_URL = `${environment.API_URL}/comercios`;

  constructor(private http: HttpClient) { }

  getComercio(comercio_id:number): Observable<Comercio>{
    const url = `${this.API_URL}/${comercio_id}`;
    return this.http.get<Comercio>(url);
  }

  getComercios(): Observable<Comercio[]>{
    return this.http.get<Comercio[]>(this.API_URL);
  }

  getComercioShort(): Observable<Comercio[]>{
    const url = `${environment.API_URL}/cercamio`;
    return this.http.get<Comercio[]>(url);
  }

  createComercio(comercio: Comercio): Observable<any>{
    return this.http.post<Comercio>(this.API_URL, comercio);
  }

  updateComercio(comercio: Comercio): Observable<any>{
   
    const url = `${this.API_URL}/${comercio.id}`;
    return this.http.put(url, comercio);
  }

  deleteComercio(comercio: Comercio): Observable<any>{
    const url = `${this.API_URL}/${comercio.id}`;
    return this.http.delete(url);
  }
}
