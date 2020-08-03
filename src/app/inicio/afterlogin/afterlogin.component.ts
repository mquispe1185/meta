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
                       this.router.navigate(['adminpanel']);
                        break; 
                     } 
                     case 2: { 
                       this.router.navigate(['comerciopanel']);
                        break; 
                     } 
                     default: { 
                        //statements; 
                        break; 
                     } 
                  } 
                  }
                )
                
               }

  ngOnInit(): void {
   //this.tokenService.processOAuthCallback();
  
   
    //console.log('nombre:::::::::::',this.tokenService.currentUserData.name);
  }

}
