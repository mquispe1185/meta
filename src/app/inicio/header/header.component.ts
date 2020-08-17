import { Component, OnInit } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public tokenService: AngularTokenService,
    public router: Router,) { }

  ngOnInit(): void {
    console.log('llegamos a panel admin');
    this.tokenService.processOAuthCallback();
  }



  salir():void{
    this.tokenService.signOut().subscribe(res => {
      localStorage.clear();
      console.log('respuesta de logout',res);
      console.log('user log true? after logout::::',this.tokenService.userSignedIn());
      console.log('user data despues de logout',this.tokenService.currentUserData);
      //this.toastr.warning('Sesión finalizada', 'Adiós '+this.tokenService.currentUserData.nombre+'!');
      this.router.navigate(['login']);
    },error => {
      console.log('test error',error);
      this.router.navigate(['login']);
    });
  }
}
