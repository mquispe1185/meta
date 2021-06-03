import { Injectable } from '@angular/core';
import { Comercioplan } from './../modelos/comercioplan';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Comercio } from '../modelos/comercio';

@Injectable({
providedIn: 'root'
})
export class ComercioplanService {
API_URL = `${environment.API_URL}/comercioplanes`;

constructor(private http: HttpClient) { }
getComerciosPlanes(): Observable<Comercioplan[]>{
const url = `${this.API_URL}`;
return this.http.get<Comercioplan[]>(url);
}
updateComercioPlan(comercioplan:Comercioplan): Observable<any>{
const url = `${this.API_URL}`;
return this.http.post<Comercio>(url, comercioplan);
//return this.http.put(url, {comercio_id: comercio.id, tipo_servicio: comercio.tipo_servicio});
}
habilitarComercioplan(comercioplan: Comercioplan): Observable<any>{
  const url = `${this.API_URL}/${comercioplan.id}`;
  return this.http.put(url, comercioplan);
}
//Funcion para panel Admin "Gestion Planes"
editComercioPlanByAdmin(comercioplan:Comercioplan):Observable<any>{
const url = `${this.API_URL}/${comercioplan.id}/admin_update`
return this.http.put(url, comercioplan);
}
}
