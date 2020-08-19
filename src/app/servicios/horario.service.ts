import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from '../modelos/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  API_URL = `${environment.API_URL}/horarios`;

  constructor(private http: HttpClient) { }

  getHorarios(): Observable<Horario[]>{
    return this.http.get<Horario[]>(this.API_URL);
  }

  createHorarios(rol: Horario): Observable<any>{
    return this.http.post<Horario>(this.API_URL, rol);
  }

  saveHorarios(horarios:Horario[]): Observable<any> {
    var laboral = { horarios: horarios }
    return this.http.post<Horario[]>(this.API_URL,laboral);
  }

  updateHorario(rol: Horario): Observable<any>{
    const url = `${this.API_URL}/${rol.id}`;
    return this.http.put(url, rol);
  }

  deleteHorario(rol: Horario): Observable<any>{
    const url = `${this.API_URL}/${rol.id}`;
    return this.http.delete(url);
  }

}
