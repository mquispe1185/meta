import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promocion } from '../modelos/promocion';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  API_URL = `${environment.API_URL}/promociones`;

  constructor(private http: HttpClient) { }

  getPromocion(usuario_id:number): Observable<Promocion>{
    const url = `${this.API_URL}/${usuario_id}`;
    return this.http.get<Promocion>(url);
  }

  //usado por admin
  getPromociones(): Observable<Promocion[]>{
    return this.http.get<Promocion[]>(this.API_URL);
  }

  //usado para q un usuario pueda ver sus promos
  getMisPromo(): Observable<Promocion[]>{
      const url = `${environment.API_URL}/mis_promos`;
      return this.http.get<Promocion[]>(url);
  }

  //usado para pagina de inicio
  getPromoShort(): Observable<Promocion[]>{
    const url = `${environment.API_URL}/promos`;
    return this.http.get<Promocion[]>(url);
  }

  createPromocion(promocion: Promocion): Observable<any>{
    return this.http.post<Promocion>(this.API_URL, promocion);
  }

  updatePromocion(promocion: Promocion): Observable<any>{

    const url = `${this.API_URL}/${promocion.id}`;
    return this.http.put(url, promocion);
  }

  habilitarPromo(promocion:Promocion): Observable<any>{

    const url = `${environment.API_URL}/habilitar_promo?promocion_id=${promocion.id}`;
    return this.http.put(url, {id: promocion.id, estado: promocion.estado});
  }

  deletePromocion(promocion: Promocion): Observable<any>{
    const url = `${this.API_URL}/${promocion.id}`;
    return this.http.delete(url);
  }
}
