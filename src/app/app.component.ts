import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import sceneData from '../assets/sample2.json';
import { Equipment } from './equipment';
import { SceneObject } from './scene-object';

import { ThreeJSScene } from './three-js-scene';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;
  public title : string = 'threejs-angular';
  private threeJSScene!: ThreeJSScene;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.threeJSScene = new ThreeJSScene(this.rendererCanvas.nativeElement);
    this.createRackWithEquipment();
    this.loadSceneFromJSON(sceneData);

    this.threeJSScene.animate();
  }

  private createRackWithEquipment() {
    const rack = new THREE.Group();

    // Create the rack frame
    const frameGeometry = new THREE.BoxGeometry(1, 10, 1);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const frame1 = new THREE.Mesh(frameGeometry, frameMaterial);
    frame1.position.set(-2, 5, -2);
    rack.add(frame1);

    const frame2 = new THREE.Mesh(frameGeometry, frameMaterial);
    frame2.position.set(2, 5, -2);
    rack.add(frame2);

    const frame3 = new THREE.Mesh(frameGeometry, frameMaterial);
    frame3.position.set(-2, 5, 2);
    rack.add(frame3);

    const frame4 = new THREE.Mesh(frameGeometry, frameMaterial);
    frame4.position.set(2, 5, 2);
    rack.add(frame4);

    // Create the equipment stack with separation and connectors
    for (let i = 0; i < 8; i++) {
      const equipment = new Equipment();
      equipment.position.set(0, i * 1.2 + 0.5, 0); // Add separation between boxes
      rack.add(equipment);
    }

    this.threeJSScene.scene.add(rack);
  }

  private loadSceneFromJSON(data: any) {
    // Set background color
    this.threeJSScene.renderer.setClearColor(data.backGroundColor);

    // Add camera settings
    this.threeJSScene.camera.position.set(data.camera.position.x, data.camera.position.y, data.camera.position.z);
    this.threeJSScene.camera.lookAt(new THREE.Vector3(data.camera.lookAt.x, data.camera.lookAt.y, data.camera.lookAt.z));

    // Add objects
    data.children.forEach((childData: any) => {
      const sceneObject = new SceneObject(childData);
      this.threeJSScene.scene.add(sceneObject.createObject());
    });
  }



}