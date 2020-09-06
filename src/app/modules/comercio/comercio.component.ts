import { Component, OnInit } from '@angular/core';
import { Comercio } from '../../modelos/comercio';

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styleUrls: ['./comercio.component.css']
})
export class ComercioComponent implements OnInit {

  comercio:Comercio = JSON.parse(localStorage.getItem('comercio'));

  constructor() { }

  ngOnInit(): void {
    console.log('comercio en ver',this.comercio);
  }

}
