import { FooterVisitantesComponent } from './footer-visitantes/footer-visitantes.component';
import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';


@NgModule({
  declarations: [FooterComponent,FooterVisitantesComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [ FooterComponent,FooterVisitantesComponent ]
})
export class SharedModule { }
