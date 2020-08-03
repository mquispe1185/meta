import { Injectable } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanLoad {

  // PARA PROTEGER URL DE COMERCIOS
  constructor(private tokenService: AngularTokenService, 
              private router: Router) {
  }
  canLoad( ): boolean {
    console.log('user log???',this.tokenService.userSignedIn());
    if (this.tokenService.userSignedIn() && this.tokenService.currentUserData){
      if(this.tokenService.currentUserData.rol_id === 2){
        return true;
      }else{
        this.router.navigate(['login']);
        return false;
      }
    }else{
      this.router.navigate(['login']);
      return false;
    }
    		
  }
} 
