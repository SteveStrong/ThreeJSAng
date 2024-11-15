import * as THREE from 'three';

export class WaterMolecule extends THREE.Group {
  constructor() {
    super();

    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32);

    // Oxygen atom
    const oxygenMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const oxygen = new THREE.Mesh(sphereGeometry, oxygenMaterial);
    oxygen.position.set(0, 0, 0);
    this.add(oxygen);

    // Hydrogen atoms
    const hydrogenMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const hydrogen1 = new THREE.Mesh(sphereGeometry, hydrogenMaterial);
    hydrogen1.position.set(1, 1, 0);
    this.add(hydrogen1);

    const hydrogen2 = new THREE.Mesh(sphereGeometry, hydrogenMaterial);
    hydrogen2.position.set(-1, 1, 0);
    this.add(hydrogen2);

    // Bonds
    const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    const bond1 = new THREE.Mesh(cylinderGeometry, bondMaterial);
    bond1.position.set(0.5, 0.5, 0);
    bond1.rotation.z = -Math.PI / 4;
    this.add(bond1);

    const bond2 = new THREE.Mesh(cylinderGeometry, bondMaterial);
    bond2.position.set(-0.5, 0.5, 0);
    bond2.rotation.z = Math.PI / 4;
    this.add(bond2);
  }
}