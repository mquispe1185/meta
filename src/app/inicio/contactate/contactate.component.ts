import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/servicios/datos.service';
import { MensajeConsulta } from '../../modelos/mensaje-consulta';
@Component({
  selector: 'app-contactate',
  templateUrl: './contactate.component.html',
  styleUrls: ['./contactate.component.css']
})
export class ContactateComponent implements OnInit {
  enviado=false;
  emailpattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  consulta:MensajeConsulta= new MensajeConsulta();
  constructor( private datosService:DatosService ) { }

  ngOnInit(): void {
  }

  sendMail(){
    this.datosService.sendConsulta(this.consulta).subscribe(
      res => { this.enviado = true; }
    )
  }

}
