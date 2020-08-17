import { Directive, OnInit, EventEmitter, ElementRef, Output, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
declare var google:any;
@Directive({
  selector: '[google-place]'
})
export class GooglePlacesDirectiveDirective implements OnInit{

  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;

  
  constructor(private elRef: ElementRef,private mapsAPILoader: MapsAPILoader,) {
    //elRef will get a reference to the element where
    //the directive is placed
    this.element = elRef.nativeElement;
    //this.searchElementRef = elRef.nativeElement;
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
    const autocomplete = new google.maps.places.Autocomplete(this.element);
     google.maps.event.addListener(autocomplete, 'place_changed', () => {
      //Emit the new address object for the updated place
      this.onSelect.emit(autocomplete);
});
});
  }


}
