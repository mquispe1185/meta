import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularTokenService } from 'angular-token';
import { MapsAPILoader} from '@agm/core';
import { OwlOptions } from 'ngx-owl-carousel-o';


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
        items: 1
      },
      400: {
        items: 2
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
    private _sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    console.log('user log true? en inicio::::',this.tokenService.userSignedIn());
    console.log('user data en inicio',this.tokenService.currentUserData);
   // this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/bR1dUUjOk28");
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  login(){
    this.tokenService.signInOAuth('google');
  }

  salir(){
    this.tokenService.signOut().subscribe(
      res => console.log('adios!!',res),
      error => console.log('adios!!',error)
    );
  }

}
