import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularTokenService } from 'angular-token';
import { MapsAPILoader} from '@agm/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comercio } from '../modelos/comercio';
import { ComercioService } from '../servicios/comercio.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

 comercios:Comercio[]=[];
  buscado:string='';

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 3
      },
      740: {
        items: 3
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
              private toastr: ToastrService,
              ) { }

  ngOnInit(): void {
    console.log('user log true? en inicio::::',this.tokenService.userSignedIn());
    console.log('user data en inicio',this.tokenService.currentUserData);
   // this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/bR1dUUjOk28");
   this.tokenService.validateToken().subscribe(
     res =>{ console.log('datos despues de validate',this.tokenService.currentUserData);}
   );
   this.getComercios();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.querySelector('.menub');
    if (window.pageYOffset > 365) {
      element.classList.add('menunar');
      console.log('supera los 365');
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
    localStorage.setItem('comercio',JSON.stringify(comer));
    this.router.navigate(['comercio']);
  }
  salir(){
 
    this.tokenService.signOut().subscribe(
      res => console.log('adios!!',res),
      error => console.log('adios!!',error)
    );
  }


  getComercios(){
    this.comercioService.getComercios().subscribe(
      cms =>{this.comercios = cms;
              console.log('mis comerc',cms);
             }
    )
  }

  buscarComercios(){
    console.log('buscandoooo', this.buscado);
  }
}
