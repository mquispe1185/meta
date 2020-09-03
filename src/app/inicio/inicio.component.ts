import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularTokenService } from 'angular-token';
import { MapsAPILoader} from '@agm/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  // images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);
  // safeUrl;

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
              private _sanitizer: DomSanitizer
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

  irAComercio(){
    console.log('redirect a comer panel');
    this.router.navigate(['comerciopanel']);
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

  verComercio(){
    this.router.navigate(['comercio']);
  }
  salir(){
 
    this.tokenService.signOut().subscribe(
      res => console.log('adios!!',res),
      error => console.log('adios!!',error)
    );
  }

}
