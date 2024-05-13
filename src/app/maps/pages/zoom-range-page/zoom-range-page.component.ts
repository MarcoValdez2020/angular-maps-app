import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit {

  public zoom: number = 10;
  public map?: Map;

  // pasamos la referencia del viewChild
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'elemento html no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListener();
  }

  mapListener(): void {
    if (!this.map) throw 'Mapa no inicializado'
    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    })

    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() > 18) {
        this.map!.zoomTo(18);
      } else if (this.map!.getZoom() < 0) {
        this.map!.zoomTo(0);
      }
    })

  }


  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  zoomChanged(value:string):void{
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }

}
