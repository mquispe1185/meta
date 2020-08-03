import { Injectable } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {
  constructor(private tokenService: AngularTokenService, 
    private router: Router) {
}
canLoad( ): boolean {
console.log('user log???',this.tokenService.userSignedIn());
if (this.tokenService.userSignedIn() && this.tokenService.currentUserData){
  if(this.tokenService.currentUserData.rol_id === 1){
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
