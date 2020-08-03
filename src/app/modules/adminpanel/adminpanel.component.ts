import { Component, OnInit } from '@angular/core';
import { AngularTokenService } from 'angular-token';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {

  constructor(public tokenService: AngularTokenService,) { }

  ngOnInit(): void {
    this.tokenService.processOAuthCallback();
    this.tokenService.validateToken().subscribe(
      res => {console.log('holaaa',res)}
    )
  }

}
