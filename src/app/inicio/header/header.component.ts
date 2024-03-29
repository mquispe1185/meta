import { Component, OnInit, HostListener } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ComercioService } from '../../servicios/comercio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  esInicio=false;
  constructor(public tokenService: AngularTokenService,
              public router: Router,
              private comercioService: ComercioService,
              private toastr: ToastrService,) { }



    ngOnInit(): void {
      this.tokenService.validateToken().subscribe(
       res =>{ //console.log('datos despues de validate',this.tokenService.currentUserData);
      }
     );
    }

    irAMiComercio(){
      this.tokenService.validateToken().subscribe(
        res =>{ this.router.navigate(['comerciopanel']);},
        err =>{this.toastr.error('primero debe loquearse!', 'Ingrese al sistema con Gmail!');}
      );
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(e) {
      let element = document.querySelector('.menub');
      if (window.pageYOffset > 65) {
        element.classList.add('menunar');
      } else {
        element.classList.remove('menunar');
      }
    }

  irInicio(){
    this.router.navigate(['inicio']);
  }

  irGestionComercios(){
    this.router.navigate(['listacomercios']);
  }

  irPromos(){
    switch(this.tokenService.currentUserData.rol_id) {
      case 1: {
        this.router.navigate(['listapromos']);
         break;
      }
      case 2: {
        this.router.navigate(['mispromos']);
         break;
      }
   }
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

  salir():void{
    this.tokenService.signOut().subscribe(res => {
      localStorage.clear();
      this.router.navigate(['inicio']);
    },error => {
      console.log('test error',error);
      this.router.navigate(['inicio']);
    });
  }
  login(){}
}
