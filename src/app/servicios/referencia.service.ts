import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Referencia } from '../modelos/referencia';

@Injectable({
  providedIn: 'root'
})
export class ReferenciaService {

  API_URL = `${environment.API_URL}/referencias`;

  constructor(private http: HttpClient) { }

  getReferencias(comercio_id:number): Observable<Referencia[]>{
    const url = `${this.API_URL}?comercio_id=${comercio_id}`;
    return this.http.get<Referencia[]>(url);
  }

  createReferencia(refe: Referencia): Observable<any>{
    return this.http.post<Referencia>(this.API_URL, refe);
  }

  updateReferencia(refe: Referencia): Observable<any>{
    const url = `${this.API_URL}/${refe.id}`;
    return this.http.put(url, refe);
  }

  deleteReferencia(refe: Referencia): Observable<any>{
    const url = `${this.API_URL}/${refe.id}`;
    return this.http.delete(url);
  }
}
