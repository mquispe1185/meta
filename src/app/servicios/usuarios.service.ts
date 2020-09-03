import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  API_URL = `${environment.API_URL}/usuarios`;

  constructor(private http: HttpClient) { }

  getUsuario(usuario_id:number): Observable<Usuario>{
    const url = `${this.API_URL}/${usuario_id}`;
    return this.http.get<Usuario>(url);
  }

  getUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.API_URL);
  }

  getUsuariosShort(): Observable<Usuario[]>{
    const url = `${environment.API_URL}/mis_usuarios`;
    return this.http.get<Usuario[]>(url);
  }

  createUsuario(usuario: Usuario): Observable<any>{
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  updateUsuario(usuario: Usuario): Observable<any>{
   
    const url = `${this.API_URL}/${usuario.id}`;
    return this.http.put(url, usuario);
  }

  habilitarUsuario(usuario: Usuario): Observable<any>{
   
    const url = `${environment.API_URL}/habilitar_usuario?usuario_id=${usuario.id}`;
    return this.http.put(url, usuario);
  }

  deleteUsuario(usuario: Usuario): Observable<any>{
    const url = `${this.API_URL}/${usuario.id}`;
    return this.http.delete(url);
  }
}
