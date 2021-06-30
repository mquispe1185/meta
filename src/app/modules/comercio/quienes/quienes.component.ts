import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-quienes',
  templateUrl: './quienes.component.html',
  styleUrls: ['./quienes.component.css']
})
/* export class QuienesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} */

export class QuienesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('demoYouTubePlayer') demoYouTubePlayer: ElementRef<HTMLDivElement>;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    public deviceService: DeviceDetectorService,) { }

  ngOnInit(): void {
  }

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
