import { Comercioplan } from './../modelos/comercioplan';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
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

  getComerciosInicio(): Observable<Comercio[]>{
    const url = `${environment.API_URL}/listacomercios`;
    return this.http.get<Comercio[]>(url);
  }

  getVerMasComercios(cantidad:number): Observable<Comercio[]>{
    const url = `${environment.API_URL}/ver_mas?n=${cantidad}`;
    return this.http.get<Comercio[]>(url);
  }

  buscarComercios(term:string): Observable<Comercio[]>{
    const url = `${environment.API_URL}/buscar?term=${term}`;
    return this.http.get<Comercio[]>(url);
  }

  buscarComerciosRubro(term:string): Observable<Comercio[]>{
    const url = `${environment.API_URL}/buscar_rubro?term=${term}`;
    return this.http.get<Comercio[]>(url);
  }

  getMisComercios(): Observable<Comercio[]>{
    const url = `${environment.API_URL}/miscomercios`;
    return this.http.get<Comercio[]>(url);
  }

  getComercioShort(): Observable<Comercio[]>{
    const url = `${environment.API_URL}/cercamio`;
    return this.http.get<Comercio[]>(url);
  }

  addVisitaComercio(comercio_id:number): Observable<any>{
    const url = `${environment.API_URL}/add_visita?comercio_id=${comercio_id}`;
    return this.http.put(url, comercio_id);
  }

  addVisitaLinkComercio(link:number,comercio_id:number): Observable<any>{
    const url = `${environment.API_URL}/add_visita_links`;
    return this.http.put(url, {comercio_id: comercio_id,link: link});
  }

  getEstadisticaLinks(comercio_id:number): Observable<Comercio>{
    const url = `${environment.API_URL}/estadistica_links?comercio_id=${comercio_id}`;
    return this.http.get<Comercio>(url);
  }

  createComercio(comercio: Comercio): Observable<any>{
    return this.http.post<Comercio>(this.API_URL, comercio);
  }

  updateComercio(comercio: Comercio): Observable<any>{
    const url = `${this.API_URL}/${comercio.id}`;
    return this.http.put(url, comercio);
  }

  habilitarComercio(comercio_id: number): Observable<any>{
    const url = `${environment.API_URL}/habilitar_comercio?comercio_id=${comercio_id}`;
    return this.http.put(url, comercio_id);
  }


  deleteComercio(comercio: Comercio): Observable<any>{
    const url = `${this.API_URL}/${comercio.id}`;
    return this.http.delete(url);
  }

  uploadFotos(fotos:File[],comercio_id:number):Observable<any> {
    const formdata: FormData = new FormData();
    const url = `${environment.API_URL}/set_fotos`;
    fotos.forEach(
      foto => formdata.append('fotos[]', foto)
    )
    formdata.append('id', comercio_id.toString());
    return this.http.put(url, formdata);
  }

  deleteFoto(foto_id:number,comercio: Comercio): Observable<any>{
    const url = `${this.API_URL}/${comercio.id}/delete_foto?foto_id=${foto_id}`;
    return this.http.delete(url);
  }
}
