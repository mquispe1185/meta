import { Component, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { InicioComponent } from '../inicio.component';
import { ComercioService } from '../../servicios/comercio.service';

@Component({
  selector: 'app-header-visitantes',
  templateUrl: './header-visitantes.component.html',
  styleUrls: ['./header-visitantes.component.css']
})
export class HeaderVisitantesComponent implements OnInit {



  constructor(public tokenService: AngularTokenService,
              public router: Router,
              private comercioService: ComercioService,
              private toastr: ToastrService,
    ) { }


  ngOnInit(): void {

    console.log('user log true? en inicio::::',this.tokenService.userSignedIn());
    console.log('user data en inicio',this.tokenService.currentUserData);
   // this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/bR1dUUjOk28");
    this.tokenService.validateToken().subscribe(
     res =>{ console.log('datos despues de validate',this.tokenService.currentUserData);}
   );

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.querySelector('.menub');
    if (window.pageYOffset > 65) {
      element.classList.add('menunar');
     // console.log('supera los 365');
    } else {
      element.classList.remove('menunar');
    }
  }
  desplazar(seccion) {
    console.log('NAVEGANDO');
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

  // verComercio(comer){
  //   localStorage.setItem('comercio',JSON.stringify(comer));
  //   this.router.navigate(['comercio']);
  // }


  salir(){

    this.tokenService.signOut().subscribe(
      res => {  localStorage.clear();
        this.router.navigate(['inicio']);},
      error => {this.router.navigate(['inicio']);}
    );
  }


  // getComercios(){
  //   this.comercioService.getComercios().subscribe(
  //     cms =>{this.comercios = cms;
  //             console.log('mis comerc',cms);
  //            }
  //   )
  // }

  // buscarComercios(){
  //   console.log('buscandoooo', this.buscado);
  // }

}
