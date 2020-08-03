import { Component, OnInit } from '@angular/core';
import { AngularTokenService } from 'angular-token';

@Component({
  selector: 'app-comerciopanel',
  templateUrl: './comerciopanel.component.html',
  styleUrls: ['./comerciopanel.component.css']
})
export class ComerciopanelComponent implements OnInit {

  constructor(public tokenService: AngularTokenService,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe( 
    )
  }

}
