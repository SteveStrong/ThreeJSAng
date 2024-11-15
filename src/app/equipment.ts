import * as THREE from 'three';

export class Equipment extends THREE.Group {
  constructor() {
    super();

    // Create the equipment box
    const equipmentGeometry = new THREE.BoxGeometry(3, 1, 3);
    const equipmentMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const equipment = new THREE.Mesh(equipmentGeometry, equipmentMaterial);
    this.add(equipment);

    // Create the connectors
    const connectorGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    const connector1 = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector1.position.set(0, 0, -1.75);
    connector1.rotation.x = -Math.PI / 2; // Rotate the cone so the base is on the box
    this.add(connector1);

    const connector2 = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector2.position.set(1, 0, -1.75);
    connector2.rotation.x = -Math.PI / 2; // Rotate the cone so the base is on the box
    this.add(connector2);

    const connector3 = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector3.position.set(-1, 0, -1.75);
    connector3.rotation.x = -Math.PI / 2; // Rotate the cone so the base is on the box
    this.add(connector3);

    // Create the knobs
    const knobGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
    const knobMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const knobPositions = [
      -1.5, -1, -0.5, 0.5, 1, 1.5
    ];

    knobPositions.forEach((xPos) => {
      const knob = new THREE.Mesh(knobGeometry, knobMaterial);
      knob.position.set(xPos, 0, 1.75); // Move to the middle of the front face
      knob.rotation.x = Math.PI / 2; // Rotate the knob to face forward
      this.add(knob);
    });
  }
}