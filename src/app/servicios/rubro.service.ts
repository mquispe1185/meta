import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Rubro } from '../modelos/rubro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RubroService {
  API_URL = `${environment.API_URL}/rubros`;

  constructor(private http: HttpClient) { }


  getRubros(): Observable<Rubro[]>{
    return this.http.get<Rubro[]>(this.API_URL);
  }
}
