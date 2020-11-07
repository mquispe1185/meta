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

      console.log('user log true? en inicio::::',this.tokenService.userSignedIn());
      console.log('user data en inicio',this.tokenService.currentUserData);
     // this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/bR1dUUjOk28");
      this.tokenService.validateToken().subscribe(
       res =>{ console.log('datos despues de validate',this.tokenService.currentUserData);}
     );
        console.log('urllll',this.router.url)
    }
  

  
    irAMiComercio(){
      this.tokenService.validateToken().subscribe(
        res =>{ this.router.navigate(['comerciopanel']);},
        err =>{this.toastr.error('primero debe loquearse!', 'Ingrese al sistema con Gmail!');}
      );
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
  salir():void{
    this.tokenService.signOut().subscribe(res => {
      localStorage.clear();
      console.log('respuesta de logout',res);
      console.log('user log true? after logout::::',this.tokenService.userSignedIn());
      console.log('user data despues de logout',this.tokenService.currentUserData);
      //this.toastr.warning('Sesión finalizada', 'Adiós '+this.tokenService.currentUserData.nombre+'!');
      this.router.navigate(['inicio']);
    },error => {
      console.log('test error',error);
      this.router.navigate(['inicio']);
    });
  }
}
