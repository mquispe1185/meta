import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComercioComponent } from './comercio.component';

const routes: Routes = [
  {
    path:'', 
    component: ComercioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComercioRoutingModule { }
