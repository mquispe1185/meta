import { Promocion } from './../modelos/promocion';
import { PromocionesService } from './../servicios/promociones.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularTokenService } from 'angular-token';
import { MapsAPILoader} from '@agm/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comercio } from '../modelos/comercio';
import { ComercioService } from '../servicios/comercio.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],

})
export class InicioComponent implements OnInit {

  @ViewChild ('ben')ben;

  comercios:Comercio[]=[];
  buscado:string='';
  promociones:Promocion[]=[];

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      520: {
        items: 4
      },
      940: {
        items: 5
      }
    },
    nav: true
  }

  constructor(public tokenService: AngularTokenService,
              public router: Router,
              private comercioService:ComercioService,
              private promoService:PromocionesService,
              private toastr: ToastrService,
              ) { }


  ngOnInit(): void {
    /*  console.log('user log true? en inicio::::',this.tokenService.userSignedIn());
    console.log('user data en inicio',this.tokenService.currentUserData); */
    this.listen();
   this.tokenService.validateToken().subscribe(
     res =>{ console.log('datos despues de validate',this.tokenService.currentUserData);}
   );
   this.getComercios();
   this.getPromos();
  }


  listen() {
    this.router.events.subscribe(val => {
     // console.log('estamos en LISTE');
      if (val instanceof NavigationEnd) {
        let fragmentIdx = val.urlAfterRedirects.lastIndexOf('#');
        if (fragmentIdx >= 0 && fragmentIdx < val.urlAfterRedirects.length - 1) {
          let fragment = val.urlAfterRedirects.substring(fragmentIdx+1);
          // console.log('fragment: ' + fragment);
          document.getElementById(fragment).scrollIntoView();
        }
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.querySelector('.menub');
    if (window.pageYOffset > 65) {
      element.classList.add('menunar');
    //  console.log('Dani supera los 65');
    } else {
      element.classList.remove('menunar');
    }
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
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
        this.router.navigate(['adminpanel']);
         break;
      }
      case 2: case 3: {
        this.router.navigate(['comerciopanel']);
         break;
      }

   }
  }

  verComercio(comer){
    localStorage.removeItem('comercio_id');
  //  localStorage.removeItem('comercio');
    localStorage.setItem('comercio_id',comer);
    this.router.navigate(['comercio',comer]);
  }

  salir(){

    this.tokenService.signOut().subscribe(
      res => console.log('adios!!',res),
      error => console.log('adios!!',error)
    );
  }


  getComercios(){
    this.comercioService.getComerciosInicio().subscribe(
      cms =>{this.comercios = cms;

             }
    )
  }

  verMasComercios(){
    this.comercioService.getVerMasComercios(this.comercios.length).subscribe(
      cms =>{ this.comercios = this.comercios.concat(cms);}
    )
  }
  buscarComercios(){
    this.comercioService.buscarComercios(this.buscado).subscribe(
      cms =>{this.comercios = cms;
        document.getElementById("promo").scrollIntoView();
       }
    )
  }

  buscarPorRubro(buscado){

   this.comercioService.buscarComerciosRubro(buscado).subscribe(
      cms =>{this.comercios = cms;
        document.getElementById("promo").scrollIntoView();
       }
    )
  }

  /*trae las promociones*/
  getPromos(){
    this.promoService.getPromoShort().subscribe(
      prs =>{this.promociones = prs;}
    )
  }
}
