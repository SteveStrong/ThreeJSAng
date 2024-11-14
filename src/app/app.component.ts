import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ThreeJSAng';
  
  @ViewChild('rendererCanvas') rendererCanvas!: ElementRef;
  
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model!: THREE.Group;
  private controls!: OrbitControls;
  private cube!: THREE.Mesh;  // Add cube property

  constructor() {}

  ngOnInit(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2c3e50);
  }

  ngAfterViewInit(): void {
    this.setupThreeJS();
    this.addCube();  // Add cube first
    this.createMeshes();
    this.loadModel();
    this.animate();
  }

  private setupThreeJS(): void {
    const canvas = this.rendererCanvas.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(
      75, width / height, 0.1, 1000
    );
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    window.addEventListener('resize', () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }

  private addCube(): void {
    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00,
      flatShading: true
    });
    this.cube = new THREE.Mesh(geometry, material);
    
    // Position the cube above the ground
    this.cube.position.set(2, 0, 0);  // Moved to the right
    this.cube.castShadow = true;
    
    // Add cube to scene
    this.scene.add(this.cube);
  }

  private createMeshes() {
    // Create Group1
    const group1 = new THREE.Group();
    
    // Box1
    const box1Geometry = new THREE.BoxGeometry(1.2, 0.5, 1);
    const box1Material = new THREE.MeshStandardMaterial({ color: 'magenta' });
    const box1 = new THREE.Mesh(box1Geometry, box1Material);
    box1.position.set(-5, 0, 0);
    group1.add(box1);

    // Box2
    const box2Geometry = new THREE.BoxGeometry(1.2, 0.5, 1);
    const box2Material = new THREE.MeshStandardMaterial({ color: 'green' });
    const box2 = new THREE.Mesh(box2Geometry, box2Material);
    box2.position.set(5, 0, 0);
    group1.add(box2);

    this.scene.add(group1);

    // Create Group2
    const group2 = new THREE.Group();
    
    // Parent Box (red)
    const parentBoxGeometry = new THREE.BoxGeometry(1.2, 0.5, 1);
    const parentBoxMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
    const parentBox = new THREE.Mesh(parentBoxGeometry, parentBoxMaterial);
    
    // Box3
    const box3Geometry = new THREE.BoxGeometry(1.2, 0.5, 1);
    const box3Material = new THREE.MeshStandardMaterial({ color: 'magenta' });
    const box3 = new THREE.Mesh(box3Geometry, box3Material);
    box3.position.set(-5, 0, -5);
    parentBox.add(box3);

    // Box4
    const box4Geometry = new THREE.BoxGeometry(1.2, 0.5, 1);
    const box4Material = new THREE.MeshStandardMaterial({ color: 'green' });
    const box4 = new THREE.Mesh(box4Geometry, box4Material);
    box4.position.set(5, 0, 5);
    parentBox.add(box4);

    this.scene.add(parentBox);
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    
    loader.load(
      '/assets/T_Rex.glb',
      (gltf) => {
        this.model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
        
        // Position the model to the left of the cube
        this.model.position.set(-2, 0, 0);
        
        const scale = 1.0;
        this.model.scale.set(scale, scale, scale);
        
        this.model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        this.scene.add(this.model);

        this.controls.target.set(0, 0, 0);  // Look at the center between model and cube
        this.controls.update();
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Rotate the cube
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}