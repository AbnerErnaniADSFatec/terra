# Building a Single WebGIS
#### Abner
## -> First of All
### Create a new angular application with the following command
```
ng new MyFirstWebGis
```
## -> Run this command on app root folder
### This command is to read default styles for your application
```
npm install primeng --save
npm install primeicons --save
```
## -> One more command
### VirtualScrolling enabled Dropdown depends on @angular/cdk's ScrollingModule so begin with installing CDK if not already installed.
```
npm install @angular/cdk --save
```
## -> Go to the folder created by last command
### Modify the angular.json to this code
```
"styles": [
  "node_modules/primeicons/primeicons.css",
  "node_modules/primeng/resources/themes/nova-light/theme.css",
  "node_modules/primeng/resources/primeng.min.css",
  "src/styles.css",
  "node_modules/ol/ol.css"
],
"scripts": [
  "node_modules/chart.js/dist/Chart.js"
]
```
## -> Include the modules for control web map
### Go to app.module.ts and modify the imports to your browser
```
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
```
### Add the modules in app modules to configure your default map
```
imports: [
    BrowserModule,
    AppRoutingModule,
    InputSwitchModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule
]
```
## -> Import modules for creation of map
### Go to src/app/app.component.ts
```
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileWMS from 'ol/source/TileWMS';
import { defaults as defaultControls } from 'ol/control.js';
```
## -> The Open Street Map
### By default, create a new Open Street map
```
this.osm = new TileLayer({
    preload: Infinity,
    visible: true,
    title: "osm",
    baseLayer: true,
    source: new OSM(),
    layer: 'osm',
});
```
## -> Create a global variable with name MAP
### Write this code to create a new map
```
this.map = new Map({
      controls: defaultControls(),
      layers: this.osm,
      target: 'map',
      view: view
});
```
## -> Where is HTML? It's here
### On app.component.html write the following tag
```
<div id = "map" class = "map"></div>
```
## -> And finally a simple CSS for your happiness
### On app.component.css add a global css on app component for map size
```
.map {
    width: 100%;
    height: 100%;
}
```
## -> Running application
#### With the following command run the application on your choice port, by default is localhost:4200
#### This command run a live programing reports
```
ng serve --port 1212 --open
```
#### or by default
```
ng serve --open
```
#### Now enjoy your first WebGIS
