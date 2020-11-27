import { Component, OnInit } from '@angular/core';
import { ComercioService } from 'src/app/servicios/comercio.service';
import { Comercio } from '../../modelos/comercio';

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styleUrls: ['./comercio.component.css']
})
export class ComercioComponent implements OnInit {

comercio:Comercio = new Comercio();
lat: number;
lon:number;
zoom:number;
  constructor(private comercioService:ComercioService) { }

  ngOnInit(): void {
    console.log('comercio en ver',this.comercio);
    if(localStorage.hasOwnProperty("comercio_id")){
      let comercio_id = localStorage.getItem('comercio_id')
      this.comercioService.getComercio(+comercio_id).subscribe(
        cm =>{this.comercio= cm;
          this.lat = +this.comercio.latitud;
          this.lon = +this.comercio.longitud;}
      )
    }else{
    this.comercio = JSON.parse(localStorage.getItem('comercio'));
    this.lat = +this.comercio.latitud;
    this.lon = +this.comercio.longitud;
    }
    this.zoom = 16;
    console.log('lti',this.lat);
    console.log('longi',this.lon);
  }

}
