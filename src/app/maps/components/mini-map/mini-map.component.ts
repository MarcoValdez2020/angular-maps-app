import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent  implements AfterViewInit{
 // pasamos la referencia del viewChild
@ViewChild('map') divMap?: ElementRef;

 //
@Input() lngLat?:[number,number];

ngAfterViewInit(): void {
  if (!this.lngLat) throw 'LngLat cant be null';
  if (!this.divMap) throw 'elemento html no fue encontrado';

  const map = new Map({
    container: this.divMap.nativeElement, // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: this.lngLat, // starting position [lng, lat]
    zoom: 10, // starting zoom
    interactive:false,
  });

  new Marker({
    color:'red'
  })
  .setLngLat(this.lngLat)
  .addTo(map)
}

}
