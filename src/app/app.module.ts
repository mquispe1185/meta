import { SharedModule } from './modules/shared/shared.module';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent} from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { HeaderComponent } from './inicio/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenModule } from 'angular-token';
import { AfterloginComponent } from './inicio/afterlogin/afterlogin.component';
import { GuardService } from './servicios/guard.service';
import { AdminGuardService } from './servicios/admin-guard.service';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HeaderVisitantesComponent } from './inicio/header-visitantes/header-visitantes.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { PolServicioComponent } from './inicio/pol-servicio/pol-servicio.component';
import { PolPrivacidadComponent } from './inicio/pol-privacidad/pol-privacidad.component';
import { NgHttpLoaderModule } from 'ng-http-loader';

import {apikey} from '../app/modelos/apikey';
import { SeParteComponent } from './inicio/se-parte/se-parte.component';
import { ContactateComponent } from './inicio/contactate/contactate.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HeaderComponent,
    AfterloginComponent,
    HeaderVisitantesComponent,
    PolServicioComponent,
    PolPrivacidadComponent,
    SeParteComponent,
    ContactateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),

    SharedModule,
    ToastrModule.forRoot(),
    AngularTokenModule.forRoot({
      apiBase:                     environment.API_URL,
         apiPath:                   null,

         signInPath:                 'auth/sign_in',
         signInRedirect:             'inicio',
         signInStoredUrlStorageKey:  'inicio',

         signOutPath:                'auth/sign_out',
         validateTokenPath:          'auth/validate_token',
         signOutFailedValidate:      false,

         registerAccountPath:        'auth',
         deleteAccountPath:          'auth',
         registerAccountCallback:    window.location.href,

         updatePasswordPath:         'auth',
         resetPasswordPath:          'auth/password',
         resetPasswordCallback:      window.location.href,

         oAuthBase:                  environment.API_URL,
         oAuthPaths: {
             github:                 'auth/github',
             google:                'auth/google_oauth2',
         },
         oAuthCallbackPath:          'redirect',
         oAuthWindowType:            'sameWindow',
         oAuthWindowOptions:         null,

         userTypes:                 null,
         loginField:                'email',

  }),

  AgmCoreModule.forRoot({
    apiKey: apikey.GAK,
    libraries: ['places']
  }),

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
    NgbModule,


    MatNativeDateModule,

    CarouselModule,
    ImageCropperModule

  ],

  providers: [GuardService,AdminGuardService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
