import { Injectable } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { CanLoad, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanLoad {

  // PARA PROTEGER URL DE COMERCIOS
  constructor(private tokenService: AngularTokenService, 
              private router: Router) {
  }
  canLoad():  Observable<boolean> | Promise<boolean> | boolean {
    console.log('user log en guard???',this.tokenService.userSignedIn());
  
    if (this.tokenService.userSignedIn() === true){
      if(this.tokenService.currentUserData === null || this.tokenService.currentUserData === undefined){
        console.log('entramos a undefined');
        this.tokenService.validateToken().toPromise()
        .then((res) => {
          console.log('recibimos respuesta de tokenvalidate');
                  if(this.tokenService.currentUserData.rol_id === 2 ||
                    this.tokenService.currentUserData.rol_id === 3 ){
                    this.router.navigate(['comerciopanel']);
                    return true;
                  }else{
                    this.router.navigate(['inicio']);
                    return false;
                  }
        })
        
      }else{
        console.log('si hay user dataaaa')
        if(this.tokenService.currentUserData.rol_id === 2||
          this.tokenService.currentUserData.rol_id === 3){
          return true;
        }else{
          this.router.navigate(['inicio']);
          return false;
        }
      }
        
    }else{
      console.log('entramos a usuario loged false')
      this.router.navigate(['inicio']);
      return false;
    }
    		
  }
} 
