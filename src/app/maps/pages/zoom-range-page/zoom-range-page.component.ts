import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {


  public zoom: number = 9;
  public map?: Map;
  // objeto langlat para pasar de parametro
  public currentLngLat = new LngLat(-99.357676,19.833532);

  // pasamos la referencia del viewChild
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'elemento html no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });
    this.mapListener();
  }

  ngOnDestroy(): void {
    // limpiamos todos los eventos del mapa
    this.map?.remove();
  }


  mapListener(): void {
    if (!this.map) throw 'Mapa no inicializado'
    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() > 18) {
        this.map!.zoomTo(18);
      } else if (this.map!.getZoom() < 0) {
        this.map!.zoomTo(0);
      }
    });

    this.map.on('move',()=>{
      this.currentLngLat = this.map!.getCenter();
      const {lng,lat} = this.currentLngLat;
    });

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
