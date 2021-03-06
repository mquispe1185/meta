import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ComerciopanelRoutingModule } from './comerciopanel-routing.module';
import { ComerciopanelComponent } from './comerciopanel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GestioncomercioComponent } from './gestioncomercio/gestioncomercio.component';
import { AgmCoreModule } from '@agm/core';
import { ModalGooglePlacesComponent } from './modal-google-places/modal-google-places.component';
import { GooglePlacesDirectiveDirective } from '../../directives/google-places-directive.directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GestionPromosComponent } from './gestion-promos/gestion-promos.component';
import { MatNativeDateModule } from '@angular/material/core';
import { GestionMisPlanesComponent } from './gestion-mis-planes/gestion-mis-planes.component';


@NgModule({
  declarations: [ComerciopanelComponent, GestioncomercioComponent, ModalGooglePlacesComponent, GooglePlacesDirectiveDirective, GestionPromosComponent, GestionMisPlanesComponent],
  entryComponents: [ModalGooglePlacesComponent],

  imports: [
    CommonModule,
    ComerciopanelRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    AgmCoreModule,

    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    MatDatepickerModule,
    MatNativeDateModule,

    NgbModule,

    ImageCropperModule
  ],
  providers: [
    MatDatepickerModule,
    DatePipe
  ],
})
export class ComerciopanelModule {

 }
