import { Component, OnInit } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-afterlogin',
  templateUrl: './afterlogin.component.html',
  styleUrls: ['./afterlogin.component.css']
})
export class AfterloginComponent implements OnInit {

  constructor(private tokenService: AngularTokenService,
              private router: Router,) {
                this.tokenService.validateToken().subscribe(
                  res =>{ console.log('nombre:::::::::::',this.tokenService.currentUserData.rol_id);
                   switch(this.tokenService.currentUserData.rol_id) {
                     case 1: {
                      let url = 'listacomercios';
                       if (localStorage.hasOwnProperty("redirect")){
                         url = localStorage.getItem('redirect');
                       }
                       console.log('url que vamos',url)
                      this.router.navigate([url]);
                        break;
                     }
                     case 2: {
                      let url = 'comerciopanel';
                      if (localStorage.hasOwnProperty("redirect")){
                        url = localStorage.getItem('redirect');
                      }
                      console.log('url que vamos',url)
                     this.router.navigate([url]);
                        break;
                     }
                     case 3: {
                       let url = 'inicio';
                       if (localStorage.hasOwnProperty("redirect")){
                         url = localStorage.getItem('redirect');
                       }
                       console.log('url que vamos',url)
                      this.router.navigate([url]);
                       break;
                    }
                  }
                  }
                )

               }

  ngOnInit(): void {

  }

}
