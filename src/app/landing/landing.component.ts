import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as  THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointLight, AmbientLight, HemisphereLight, SpotLight, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  gltfLoader = new GLTFLoader();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  scene = null;
  camera = null;
  frustumSize = 7;
  aspect = null;
  renderer = new THREE.WebGLRenderer();
  spotlight;
  controls;
  medialabMesh = null;
  conversationMesh = null;
  fablabMesh = null;
  logomesh = null;
  animationcounter = 0;
  speechmeshes = [];
  animations = null;
  mixer = null;
  clips = null;
  carint = 0;
  yPos = {
    mediaY: -0.044314876198768616,
    converY: -0.044314876198768616,
    fablabY: -0.009189906120300283
  };


  @ViewChild('render') el: ElementRef;
  constructor() {
    this.scene = new THREE.Scene();
  }

  ngOnInit(): void {
    // LOAD GLTF AND ADD EVERYTHING TO SCENE
    this.gltfLoader.load('assets/3Dmodels/campus.gltf', (gltf) => {
      this.scene.add(gltf.scene);

      this.animations = gltf.animations;
      this.scene.children[0].traverse(n => {
        if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
          if (n.material.map) {
            n.material.map.anisotropy;
          }
        }
        if (n.isGroup) {
          n.traverse(d => {
            if (d.isMesh) {
              d.castShadow = true;
              d.receiveshadow = true;
            }
          });
        }
      });


      // this.clips = this.cloudmeshes[0].animatio
      // CAMERA CONFIGURATIONS + LIGHTS + RENDERER
      this.aspect = this.el.nativeElement.clientWidth / this.el.nativeElement.clientHeight;
      // tslint:disable-next-line: max-line-length
      this.camera = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, -10, 20);

      const light1 = new HemisphereLight(0xF9D48A, 0x000088, 6);
      this.spotlight = new SpotLight(0xFFF2A6, 4);
      this.spotlight.castShadow = true;
      this.spotlight.shadow.bias = -0.0001;
      this.spotlight.shadow.mapSize.width = 1024 * 4;
      this.spotlight.shadow.mapSize.height = 1024 * 4;
      this.spotlight.position.set(
        this.camera.position.x + 10,
        this.camera.position.y + 10,
        this.camera.position.z - 10
      );
      this.scene.add(light1, this.spotlight);
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement)


      this.scene.background = new THREE.Color(0xa7eef4);
      this.camera.position.set(-1.2978571918256083, 1.149703013863166, 1.0747605168331336);
      this.camera.rotation.x = -0.6516285699737149;
      this.camera.rotation.y = 0.6820342591363547;
      this.camera.rotation.z = 0.4481980838983481;


      this.renderer.toneMapping = THREE.ReinhardToneMapping;
      this.renderer.shadowMap.enabled = true;
      document.addEventListener('resize', this.onWindowResize, false);
      this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, true);

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.el.nativeElement.appendChild(this.renderer.domElement);
      for (const mesh of this.scene.children[0].children) {
        if (mesh.name === 'medialab') {
          this.medialabMesh = mesh;
        } else if (mesh.name === 'fablab') {
          this.fablabMesh = mesh;
        } else if (mesh.name === 'conversationroom') {
          this.conversationMesh = mesh;
        } else if (mesh.name === 'ehb_logo') {
          this.logomesh = mesh;
        } else if (mesh.name === 'speech1' || mesh.name === 'speech2' || mesh.name === 'speech3') {
          this.speechmeshes.push(mesh);
        }
      }
      for (const speech of this.speechmeshes) {
        speech.visible = false;
      }
      this.mixer = new THREE.AnimationMixer(this.scene);
      console.log(this.animations);
      setInterval(this.randomCar, 3000);
      this.mixer.clipAction(this.animations[0]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[1]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[2]).play();
      this.mixer.clipAction(this.animations[3]).play();
      this.mixer.clipAction(this.animations[4]).play();
      this.mixer.clipAction(this.animations[5]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[6]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[7]).play();
      this.mixer.clipAction(this.animations[8]).play();
      this.mixer.clipAction(this.animations[9]).play();
      this.mixer.clipAction(this.animations[10]).setLoop(THREE.LoopRepeat, 1);
      setInterval(this.animatePlane, 30000);
      // CALL ANIMATION FUNCTION
      this.animate();
    });
  }
  randomCar = () => {

    if (this.carint === 0) {
      this.mixer.clipAction(this.animations[0]).play();
      this.mixer.clipAction(this.animations[0]).reset();
    } else if (this.carint === 1) {
      this.mixer.clipAction(this.animations[1]).play();
      this.mixer.clipAction(this.animations[1]).reset();
    } else if (this.carint === 2) {
      this.mixer.clipAction(this.animations[5]).play();
      this.mixer.clipAction(this.animations[5]).reset();
    } else if (this.carint === 3) {
      this.mixer.clipAction(this.animations[6]).play();
      this.mixer.clipAction(this.animations[6]).reset();
    }
    this.carint += 1;
    if (this.carint > 3) {
      this.carint = 0;
    }


  }
  animatePlane = () => {
    this.mixer.clipAction(this.animations[10]).play();
    this.mixer.clipAction(this.animations[10]).reset();
  }
  // UPDATE MOUSEPOSITION FOR RAYCASTING
  onDocumentMouseMove = (event) => {
    this.mouse.x = (event.clientX / this.el.nativeElement.clientWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.el.nativeElement.clientHeight) * 2 + 1;
  }
  // RESIZE DOCUMENT EVENTLISTENER
  onWindowResize = () => {
    this.camera.updateProjectionMatrix();
  }
  // ANIMATION
  animate = () => {
    requestAnimationFrame(this.animate);
    this.mixer.update(0.03);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    // checkrooms
    if (intersects.length > 0) {
      if (intersects[0].object.parent.name === 'medialab') {
        this.medialabMesh.position.y = this.yPos.mediaY + 0.2;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.conversationMesh.position.y = this.yPos.converY;
        this.speechmeshes[0].visible = true;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[2].visible = false;

      } else if (intersects[0].object.parent.name === 'fablab') {
        this.fablabMesh.position.y = this.yPos.fablabY + 0.2;
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.conversationMesh.position.y = this.yPos.converY;
        this.speechmeshes[0].visible = false;
        this.speechmeshes[1].visible = true;
        this.speechmeshes[2].visible = false;
      } else if (intersects[0].object.parent.name === 'conversationroom') {
        this.conversationMesh.position.y = this.yPos.converY + 0.2;
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.speechmeshes[0].visible = false;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[2].visible = true;
      } else {
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.conversationMesh.position.y = this.yPos.converY;
        this.speechmeshes[0].visible = false;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[2].visible = false;
      }

    }
    this.logomesh.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
  }


}
