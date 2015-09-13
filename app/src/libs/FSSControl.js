import FSS from './FlatSurfaceShader';

export const MESH = {
  width: 1.2,
  height: 1.2,
  depth: 10,
  segments: 16,
  slices: 8,
  xRange: 0.3,
  yRange: 0.1,
  zRange: 1.0,
  ambient: '#555555',
  diffuse: '#FFFFFF',
  speed: 0.001
};

export const LIGHT = {
  count: 2,
  xyScalar: 1,
  zOffset: 100,
  ambient: '#182589',
  diffuse: '#85abf2',
  speed: 0.0005,
  velocityFactor: 0.1,
  gravity: 1200,
  dampening: 0.95,
  minLimit: 10,
  maxLimit: null,
  minDistance: 20,
  maxDistance: 400,
  autopilot: true,
  draw: false,
  bounds: FSS.Vector3.create(),
  step: FSS.Vector3.create(
    Math.randomInRange(0.2, 1.0),
    Math.randomInRange(0.2, 1.0),
    Math.randomInRange(0.2, 1.0)
  )
};

export const WEBGL = 'webgl';
export const CANVAS = 'canvas';
export const SVG = 'svg';

export default class FSSControl{
  constructor(container,mesh = MESH, light = LIGHT, type = CANVAS){
    this.MESH = mesh;
    this.LIGHT = light;
    this.type = type;
    this.start = Date.now();
    this.center = FSS.Vector3.create();
    this.attractor = FSS.Vector3.create();
    if(container){
      this.container = container;
    }
    else{
      this.container = document.getElementById('background');
    }
    this.createRenderer(this.type);
    this.createScene();
    this.createMesh();
    this.createLights();
    this.addEventListeners();
    this.resize(this.container.offsetWidth, this.container.offsetHeight);
    this.animate();
  }

  createRenderer(type) {
    if (this.renderer) {
      this.container.removeChild(this.renderer.element);
    }
    switch(type) {
      case WEBGL:
        this.renderer = new FSS.WebGLRenderer();
        break;
      case CANVAS:
        this.renderer = new FSS.CanvasRenderer();
        break;
      case SVG:
        this.renderer = new FSS.SVGRenderer();
        break;
    }
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.element);
  }

  createScene() {
    this.scene = new FSS.Scene();
  }

  createMesh() {
    if(this.mesh){
      this.scene.remove(this.mesh);
    }
    this.renderer.clear();
    this.geometry = new FSS.Plane(this.MESH.width * this.renderer.width, this.MESH.height * this.renderer.height, this.MESH.segments, this.MESH.slices);
    this.material = new FSS.Material(this.MESH.ambient, this.MESH.diffuse);
    this.mesh = new FSS.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Augment vertices for animation
    let v, vertex;
    for (v = this.geometry.vertices.length - 1; v >= 0; v--) {
      vertex = this.geometry.vertices[v];
      vertex.anchor = FSS.Vector3.clone(vertex.position);
      vertex.step = FSS.Vector3.create(
        Math.randomInRange(0.2, 1.0),
        Math.randomInRange(0.2, 1.0),
        Math.randomInRange(0.2, 1.0)
      );
      vertex.time = Math.randomInRange(0, Math.PIM2);
    }
  }

  createLights() {
    let scene = this.scene;
    let l, light;
    for (l = scene.lights.length - 1; l >= 0; l--) {
      light = scene.lights[l];
      scene.remove(light);
    }
    this.renderer.clear();
    for (l = 0; l < this.LIGHT.count; l++) {
      light = new FSS.Light(this.LIGHT.ambient, this.LIGHT.diffuse);
      light.ambientHex = light.ambient.format();
      light.diffuseHex = light.diffuse.format();
      scene.add(light);

      // Augment light for animation
      light.mass = Math.randomInRange(0.5, 1);
      light.velocity = FSS.Vector3.create();
      light.acceleration = FSS.Vector3.create();
      light.force = FSS.Vector3.create();

      // Ring SVG Circle
      light.ring = document.createElementNS(FSS.SVGNS, 'circle');
      light.ring.setAttributeNS(null, 'stroke', light.ambientHex);
      light.ring.setAttributeNS(null, 'stroke-width', '0.5');
      light.ring.setAttributeNS(null, 'fill', 'none');
      light.ring.setAttributeNS(null, 'r', '10');

      // Core SVG Circle
      light.core = document.createElementNS(FSS.SVGNS, 'circle');
      light.core.setAttributeNS(null, 'fill', light.diffuseHex);
      light.core.setAttributeNS(null, 'r', '4');
    }
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    FSS.Vector3.set(this.center, this.renderer.halfWidth, this.renderer.halfHeight);
    this.createMesh();
  }

  animate() {
    this.now = Date.now() - this.start;
    this.update();
    this.render();
    this.animationID = requestAnimationFrame(this.animate.bind(this));
  }

  update() {
    let now = this.now;
    let center = this.center;
    let scene = this.scene;
    let attractor = this.attractor;
    let geometry = this.geometry;
    let MESH = this.MESH;
    let LIGHT = this.LIGHT;
    let ox, oy, oz, l, light, v, vertex, offset = MESH.depth/2;

    // Update Bounds
    FSS.Vector3.copy(LIGHT.bounds, center);
    FSS.Vector3.multiplyScalar(LIGHT.bounds, LIGHT.xyScalar);

    // Update Attractor
    FSS.Vector3.setZ(attractor, LIGHT.zOffset);

    // Overwrite the Attractor position
    if (LIGHT.autopilot) {
      ox = Math.sin(LIGHT.step[0] * now * LIGHT.speed);
      oy = Math.cos(LIGHT.step[1] * now * LIGHT.speed);
      FSS.Vector3.set(attractor,
        LIGHT.bounds[0]*ox,
        LIGHT.bounds[1]*oy,
        LIGHT.zOffset);
    }

    // Animate Lights
    for (l = scene.lights.length - 1; l >= 0; l--) {
      light = scene.lights[l];

      // Reset the z position of the light
      FSS.Vector3.setZ(light.position, LIGHT.zOffset);

      // Calculate the force Luke!
      var D = Math.clamp(FSS.Vector3.distanceSquared(light.position, attractor), LIGHT.minDistance, LIGHT.maxDistance);
      var F = LIGHT.gravity * light.mass / D;
      FSS.Vector3.subtractVectors(light.force, attractor, light.position);
      FSS.Vector3.normalise(light.force);
      FSS.Vector3.multiplyScalar(light.force, F);

      // Update the light position
      FSS.Vector3.set(light.acceleration);
      FSS.Vector3.add(light.acceleration, light.force);
      FSS.Vector3.add(light.velocity, light.acceleration);
      FSS.Vector3.multiplyScalar(light.velocity, LIGHT.dampening);
      FSS.Vector3.limit(light.velocity, LIGHT.minLimit, LIGHT.maxLimit);
      let vel = FSS.Vector3.clone(light.velocity);
      FSS.Vector3.multiplyScalar(vel, LIGHT.velocityFactor);
      FSS.Vector3.add(light.position, vel);
    }

    // Animate Vertices
    for (v = geometry.vertices.length - 1; v >= 0; v--) {
      vertex = geometry.vertices[v];
      ox = Math.sin(vertex.time + vertex.step[0] * now * MESH.speed);
      oy = Math.cos(vertex.time + vertex.step[1] * now * MESH.speed);
      oz = Math.sin(vertex.time + vertex.step[2] * now * MESH.speed);
      FSS.Vector3.set(vertex.position,
        MESH.xRange*geometry.segmentWidth*ox,
        MESH.yRange*geometry.sliceHeight*oy,
        MESH.zRange*offset*oz - offset);
      FSS.Vector3.add(vertex.position, vertex.anchor);
    }

    // Set the Geometry to dirty
    geometry.dirty = true;
  }

  render() {
    let renderer = this.renderer;
    renderer.render(this.scene);

    // Draw Lights
    if (this.LIGHT.draw) {
      var l, lx, ly, light;
      for (l = this.scene.lights.length - 1; l >= 0; l--) {
        light = this.scene.lights[l];
        lx = light.position[0];
        ly = light.position[1];
        switch(this.type) {
          case CANVAS:
            renderer.context.lineWidth = 0.5;
            renderer.context.beginPath();
            renderer.context.arc(lx, ly, 10, 0, Math.PIM2);
            renderer.context.strokeStyle = light.ambientHex;
            renderer.context.stroke();
            renderer.context.beginPath();
            renderer.context.arc(lx, ly, 4, 0, Math.PIM2);
            renderer.context.fillStyle = light.diffuseHex;
            renderer.context.fill();
            break;
          case SVG:
            lx += renderer.halfWidth;
            ly = renderer.halfHeight - ly;
            light.core.setAttributeNS(null, 'fill', light.diffuseHex);
            light.core.setAttributeNS(null, 'cx', lx);
            light.core.setAttributeNS(null, 'cy', ly);
            renderer.element.appendChild(light.core);
            light.ring.setAttributeNS(null, 'stroke', light.ambientHex);
            light.ring.setAttributeNS(null, 'cx', lx);
            light.ring.setAttributeNS(null, 'cy', ly);
            renderer.element.appendChild(light.ring);
            break;
        }
      }
    }
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
//    this.container.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    FSS.Vector3.set(this.attractor, event.x, this.renderer.height - event.y);
    FSS.Vector3.subtract(this.attractor, this.center);
  }

  onWindowResize(event) {
    this.resize(this.container.offsetWidth, this.container.offsetHeight);
    this.render();
  }

  distory(){
    this.renderer.clear();

    if(this.animationID){
      cancelAnimationFrame(this.animationID);
    }

    if(this.container){
      this.container.removeChild(this.renderer.element);
    }
  }

}
