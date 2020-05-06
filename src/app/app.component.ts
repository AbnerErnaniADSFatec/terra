// Criação de desenhos e polígonos
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Draw from 'ol/interaction/Draw.js';
import TileWMS from 'ol/source/TileWMS';
import { Component, Optional } from '@angular/core';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import { Option } from './option';

// Funcões laterais do Mapa
import FullScreen from 'ol/control/FullScreen';
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import MousePosition from 'ol/control/MousePosition.js';
import { defaults as defaultControls, ScaleLine } from 'ol/control.js';
import { createStringXY } from 'ol/coordinate.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Controle do Mapa
  private map;
  private draw;
  private features;
  private source = new VectorSource({ wrapX: false });

  // Criando camadas
  private vector = new VectorLayer({
    source: this.source
  });
  private raster = new TileLayer({
    source: new OSM()
  });
  private base = new TileLayer({
    preload: Infinity,
    visible: true,
    title: "osm",
    baseLayer: true,
    source: new OSM(),
    layer: 'osm',
  });
  private layer_test = new TileLayer({
      title : 'terrama2_10:view10',
      visible: false,
      source: new TileWMS({
        url: 'http://www.terrama2.dpi.inpe.br/chuva/geoserver/wms?',
        params: {
          'LAYERS': 'terrama2_10:view10',
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'EPSG': '4674',
          'TILED': true,
          'TIME' : '1998-01-02'
        },
        preload: Infinity,
        projection: 'EPSG:4674',
        serverType: 'geoserver',
        name: 'terrama2_10:view10'
      })
  });
  

  // Controle da Página
  private options: Option[] = [
    { verbose: "Sem marcação", value: "None" },
    { verbose: "Ponto", value: "Point" },
    { verbose: "Linha", value: "LineString" },
    { verbose: "Polígono", value: "Polygon" },
    { verbose: "Círculo", value: "Circle" },
  ];
  private option_selected: Option;
  private draw_bool;
  private coord;
  private layer;

  ngOnInit() {
    this.initilizeMap();
  }

  // Iniciar as configurações do mapa
  initilizeMap(){
    this.features = [this.base, this.layer_test];
    var view = new View({
      center: [-6124801.2015823, -1780692.0106836],
      zoom: 4
    });
    var mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326', /** 3857 */
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });
    this.map = new Map({
      controls: defaultControls().extend([mousePositionControl, new FullScreen(), new DragRotateAndZoom(), new DragAndDrop()], new ScaleLine({units: 'degrees'})),
      layers: this.features,
      target: 'map',
      view: view
    });
    var camada = this.layer_test;
    this.map.on('singleclick', function(event){
      document.getElementById('info').innerHTML = '';
      var viewResolution = view.getResolution();
      var viewProjection = view.getProjection();
      var url = camada.getSource().getFeatureInfoUrl(
        event.coordinate, viewResolution, viewProjection,
        "EPSG:4326",
        { 'INFO_FORMAT' : 'text/javascript', 'propertyName' : 'formal_en' }
      );
      if(url){
        document.getElementById('info').innerHTML = '<iframe id = "infoFrame" seamless src = "' + url + '"></iframe>';
      }
    });
    var mapAuxiliar = this.map;
    this.map.on('pointermove', function(event){
      if( event.dragging ){
        return true;
      }
      var pixel = mapAuxiliar.getEventPixel(event.originalEvent);
      var hit = mapAuxiliar.forEachLayerAtPixel(pixel, function(){
        return true;
      });
      mapAuxiliar.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
  }

  addInteraction() {
    this.map.addLayer(this.raster);
    this.map.addLayer(this.vector);
    this.draw = new Draw({
      source: this.source,
      type: this.option_selected.value
    });
    this.map.addInteraction(this.draw);
  }

  removeInteraction() {
    this.map.removeLayer(this.vector);
    this.map.removeLayer(this.raster);
    this.draw = null;
  }

  drawFeature () {
    if ( this.draw_bool ) {
      this.addInteraction();
    } else {
      this.removeInteraction();
    }
  }

  setLayer () {
    this.layer_test.setVisible(this.layer);
  }
}
