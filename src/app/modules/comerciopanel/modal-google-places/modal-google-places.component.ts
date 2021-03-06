import { Component, OnInit, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-modal-google-places',
  templateUrl: './modal-google-places.component.html',
  styleUrls: ['./modal-google-places.component.css']
})
export class ModalGooglePlacesComponent implements OnInit {
  @Input() comercio;
  @Input() creando_new;
  @Output() comercioevent = new EventEmitter<string>();

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(public activeModal: NgbActiveModal,
          private zone: NgZone,
          private mapsAPILoader: MapsAPILoader,
          ) { }

  ngOnInit() {
       //load Places Autocomplete

   this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;

  });
  }

  updateUbicacion(){
  	 this.comercioevent.emit(this.comercio);
  }

  setAddress(addrObj) {
              //verify result
    if (addrObj.getPlace().geometry === undefined || addrObj.getPlace().geometry === null) {
        return;
    }

    this.zone.run(() => {
      this.comercio.domicilio = addrObj.getPlace().name;
      this.comercio.latitud = addrObj.getPlace().geometry.location.lat();
      this.comercio.longitud = addrObj.getPlace().geometry.location.lng();
      this.latitude = addrObj.getPlace().geometry.location.lat();
      this.longitude = addrObj.getPlace().geometry.location.lng();
    });
  }

    // Get Current Location Coordinates
    private setCurrentLocation() {

      if (this.comercio.longitud && this.comercio.latitud){
        this.latitude = +this.comercio.latitud;
        this.longitude = +this.comercio.longitud;
        this.zoom = 16;
        this.getAddress(this.latitude, this.longitude);
      }else{
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 16;
          this.getAddress(this.latitude, this.longitude);
        });
      }
      }
    }


    markerDragEnd($event) {

      this.latitude = $event.coords.lat;
      this.longitude = $event.coords.lng;
      this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude) {
      this.geoCoder = new google.maps.Geocoder;
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 16;
            this.address = results[0].formatted_address;

          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }

      });
    }
}
