import { Component, OnInit,  AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-preg-frecuentes',
  templateUrl: './preg-frecuentes.component.html',
  styleUrls: ['./preg-frecuentes.component.css']
})
// export class PregFrecuentesComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {

//   }
//   panelOpenState = false;

//   }

  export class PregFrecuentesComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('demoYouTubePlayer') demoYouTubePlayer: ElementRef<HTMLDivElement>;
    videoWidth: number | undefined;
    videoHeight: number | undefined;
  
    constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      public deviceService: DeviceDetectorService,) { }
  
    ngOnInit(): void {
    }
    panelOpenState = false;

    ngAfterViewInit(): void {
      this.onResize();
      window.addEventListener('resize', this.onResize);
    }
  
    onResize() {
      if (this.deviceService.isMobile()) {
        //SI ESTA UTILIZANDO MOBILE ABRE LA APLICACION WSP
        this.videoWidth = Math.min(this.demoYouTubePlayer.nativeElement.clientWidth, 320);
        this.videoHeight = this.videoWidth * 0.6;
      } else {
        //SI ESTA UTILIZANDO DESKTOP ABRE LA WEB WSP
        this.videoWidth = Math.min(this.demoYouTubePlayer.nativeElement.clientWidth, 480);
        this.videoHeight = this.videoWidth * 0.6;
      }
    }
  
    ngOnDestroy(): void {
      window.removeEventListener('resize', this.onResize);
    }
  }
