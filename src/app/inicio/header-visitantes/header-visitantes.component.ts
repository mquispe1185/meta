import { Component, OnInit, HostListener, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router, NavigationEnd } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { InicioComponent } from '../inicio.component';
import { ComercioService } from '../../servicios/comercio.service';

@Component({
  selector: 'app-header-visitantes',
  templateUrl: './header-visitantes.component.html',
  styleUrls: ['./header-visitantes.component.css']
})
export class HeaderVisitantesComponent implements OnInit {
  @ViewChild('message') message: ElementRef;
verLogo = false;
@Input('esInicio') esInicio:boolean;
  constructor(public tokenService: AngularTokenService,
              public router: Router,
              private comercioService: ComercioService,
              private toastr: ToastrService,
    ) {}

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
     res =>{ //console.log('datos despues de validate',this.tokenService.currentUserData);
    }
   );
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.querySelector('.menub');
    if (window.pageYOffset > 65) {
      element.classList.add('menunar');
      this.verLogo = true;
     // console.log('supera los 365');
    } else {
      element.classList.remove('menunar');
      this.verLogo = false;
    }
  }
  desplazar(seccion) {

    this.router.navigate(['inicio'], {fragment: seccion});
  }

  login(){
    this.tokenService.signInOAuth('google');
  }

  irAMiComercio(){
    this.tokenService.validateToken().subscribe(
      res =>{ this.router.navigate(['comerciopanel']);},
      err =>{this.toastr.error('primero debe loquearse!', 'Ingrese al sistema con Gmail!');}
    );
  }

  irAPanel(){
    if (this.tokenService.currentUserData === null || this.tokenService.currentUserData === undefined){
      this.login();
    }else{
    switch(this.tokenService.currentUserData.rol_id) {
      case 1: {
        this.router.navigate(['listacomercios']);
        break;
      }
      case 2: case 3: {
        this.router.navigate(['comerciopanel']);
        break;
      }

   }
    }
  }

  irInicio(){
    if(this.router.url.includes('/inicio')){
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }else{
      this.router.navigate(['inicio']);
    }
  }

  salir(){
    this.tokenService.signOut().subscribe(
      res => {  localStorage.clear();
        this.router.navigate(['inicio']);},
      error => {this.router.navigate(['inicio']);}
    );
  }
}
