import * as THREE from 'three';

export class SceneObject {
  public type: string;
  public position: { x: number, y: number, z: number };
  public color?: string;
  public intensity?: number;
  public distance?: number;
  public decay?: number;
  public geometry?: { width: number, height: number, depth: number };
  public material?: { color: string };
  public children?: SceneObject[];

  constructor(data: any) {
    this.type = data.type;
    this.position = data.position;
    this.color = data.color;
    this.intensity = data.intensity;
    this.distance = data.distance;
    this.decay = data.decay;
    this.geometry = data.geometry;
    this.material = data.material;
    this.children = data.children ? data.children.map((child: any) => new SceneObject(child)) : [];
  }

  public createObject(): THREE.Object3D {
    let object: THREE.Object3D;

    switch (this.type) {
      case 'AmbientLight':
        object = new THREE.AmbientLight(this.color, this.intensity);
        break;
      case 'PointLight':
        object = new THREE.PointLight(this.color, this.intensity, this.distance, this.decay);
        break;
      case 'Group':
        object = new THREE.Group();
        this.children?.forEach(child => object.add(child.createObject()));
        break;
      case 'Mesh':
        const geometry = new THREE.BoxGeometry(this.geometry!.width, this.geometry!.height, this.geometry!.depth);
        const material = new THREE.MeshStandardMaterial({ color: this.material!.color });
        object = new THREE.Mesh(geometry, material);
        break;
      default:
        object = new THREE.Object3D();
    }

    object.position.set(this.position.x, this.position.y, this.position.z);
    return object;
  }
}