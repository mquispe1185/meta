import { Component, OnInit } from '@angular/core';
import { Comercio } from '../../modelos/comercio';

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styleUrls: ['./comercio.component.css']
})
export class ComercioComponent implements OnInit {

  comercio:Comercio = JSON.parse(localStorage.getItem('comercio'));
lat: number;
lon:number; 
zoom:number;
  constructor() { }

  ngOnInit(): void {
    console.log('comercio en ver',this.comercio);
    this.lat = +this.comercio.latitud;
    this.lon = +this.comercio.longitud;
    this.zoom = 16;
    console.log('lti',this.lat);
    console.log('longi',this.lon);
  }

}
