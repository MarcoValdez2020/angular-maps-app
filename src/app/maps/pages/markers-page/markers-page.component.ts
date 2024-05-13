import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color:string;
  marker: Marker;
}

interface PlainMarker{
  color: string;
  lngLat:number[];
}
@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {

  // arreglo de marcadores
  public markers: MarkerAndColor[] = [];
  // objeto mapa
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
      zoom: 13,
    });

    this.readFromLocalStorage();
    /**
     * se pueden crear elementos htm y mapbox los acepta
        const markerHtml = document..createElement('div');
        markerHtml.innerHTML = 'Marco Valdez'
     * en este caso se coloca la etiqueta en lugar del marjer con:
        const marker = new Marker({
          element:markerHTML
        })
     */

      // agregar un marcador con diferente color
      //   const marker = new Marker({
      //     color:'red'
      //   })
      //   .setLngLat(this.currentLngLat)
      //   .addTo(this.map);
  }

  createMarker():void{
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat,color);
  }

  addMarker(lngLat:LngLat,color:string):void{
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      // con draggable indicamos que se puede mover el marcador
      draggable:true
    })
    .setLngLat(lngLat)
    .addTo(this.map)

    this.markers.push({
      color:color,
      marker:marker,
    });
    this.saveToLocalStorage();

    // actualiza el marcador en el localstorage
    marker.on('dragend', ()=> {
      this.saveToLocalStorage();
    })
  }

  deleteMarker(index:number):void{
    this.markers[index].marker.remove();
    this.markers.splice(index,1);
    // actualizamos la eliminación del elemento
    this.saveToLocalStorage()
  }

  flyTo(marker:Marker):void{
    this.map?.flyTo({
      zoom:15,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage():void{
    const plainMarkers: PlainMarker[] = this.markers.map(({color,marker})=>{
      return {
        color:color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers',JSON.stringify(plainMarkers));

  }

  readFromLocalStorage():void{
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString); //! es muy susceptible a fallos!

    plainMarkers.forEach( ({color,lngLat}) => {
      const [lng,lat] = lngLat
      const coords = new LngLat(lng,lat);

      this.addMarker(coords,color);

    })
  }

}
