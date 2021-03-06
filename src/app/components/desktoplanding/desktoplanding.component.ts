import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as  THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { HemisphereLight, SpotLight, ImageLoader, Vector2 } from 'three';
import { Router } from '@angular/router';
@Component({
  selector: 'desktop-landing',
  templateUrl: './desktoplanding.component.html',
  styleUrls: ['./desktoplanding.component.scss']
})
export class DesktopLandingComponent implements OnInit, OnDestroy {
  gltfLoader = new GLTFLoader();
  imageLoader = new ImageLoader();
  raycaster = new THREE.Raycaster();
  percentloaded = null;
  mouse = new THREE.Vector2();
  scene = null;
  camera = null;
  frustumSize = 7;
  aspect = null;
  loaded = false;
  renderer = new THREE.WebGLRenderer({ alpha: true });
  spotlight;
  medialabMesh = null;
  conversationMesh = null;
  fablabMesh = null;
  logomesh = null;
  entrancemesh = null;
  speechmeshes = [];
  animations = null;
  mixer = null;
  clips = null;
  carint = 0;
  animationBool = true;
  animationsOn = 'ON';
  animationFrame = null;
  activeLayer = 1;
  yPos = {
    mediaY: -0.044314876198768616,
    converY: -0.044314876198768616,
    fablabY: -0.009189906120300283,
    entryY: -0.4470003843307495
  };
  textmesh = null;
  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrame);
  }

  @ViewChild('render') el: ElementRef;
  constructor(private router: Router,) {
    this.scene = new THREE.Scene();
  }

  ngOnInit(): void {



    // LOAD GLTF AND ADD EVERYTHING TO SCENE
    this.gltfLoader.load('assets/3Dmodels/campus.gltf', (gltf) => {
      this.loaded = true;
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

      // CAMERA CONFIGURATIONS + LIGHTS + RENDERER
      this.aspect = this.el.nativeElement.clientWidth / this.el.nativeElement.clientHeight;
      // tslint:disable-next-line: max-line-length
      this.camera = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, -10, 20);

      const light1 = new HemisphereLight(0xffffaa, 0xd62828, 6);


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




      this.camera.position.set(-1.2978571918256083, 1.149703013863166, 1.0747605168331336);
      this.camera.rotation.x = -0.6516285699737149;
      this.camera.rotation.y = 0.6820342591363547;
      this.camera.rotation.z = 0.4481980838983481;



      this.renderer.toneMapping = THREE.ReinhardToneMapping;
      this.renderer.shadowMap.enabled = true;
      window.addEventListener('resize', this.onWindowResize, false);
      this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove, true);
      this.renderer.domElement.addEventListener('click', this.onDocumentMouseClick, true);

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.el.nativeElement.appendChild(this.renderer.domElement);

      this.scene.layers.disable(0)
      for (const mesh of this.scene.children[0].children) {

        if (mesh.name === 'medialab') {

          this.medialabMesh = mesh;


        } else if (mesh.name === 'fablab') {

          this.fablabMesh = mesh;


        } else if (mesh.name === 'conversationroom') {

          this.conversationMesh = mesh;

        } else if (mesh.name === 'ehb_logo') {

          this.logomesh = mesh;

        } else if (mesh.name === 'speech1' || mesh.name === 'speech2' || mesh.name === 'speech3' || mesh.name === 'speech4') {
          this.speechmeshes.push(mesh);
        } else if (mesh.name === 'entrance') {
          this.entrancemesh = mesh;


        } else if (mesh.name === 'terrain') {
          mesh.layers.disable(0)
        } else if (mesh.name === 'zzzzText') {
          this.textmesh = mesh
        }
      }
      for (const speech of this.speechmeshes) {
        speech.visible = false;
      }

      this.mixer = new THREE.AnimationMixer(this.scene);
      setInterval(this.randomCar, 3000);
      this.mixer.clipAction(this.animations[0]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[1]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[2]).play();
      this.mixer.clipAction(this.animations[3]).play();
      this.mixer.clipAction(this.animations[4]).play();
      this.mixer.clipAction(this.animations[5]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[6]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[7]).play();
      this.mixer.clipAction(this.animations[8]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[9]).setLoop(THREE.LoopRepeat, 1);
      this.mixer.clipAction(this.animations[10]).play();
      this.mixer.clipAction(this.animations[11]).play();
      this.mixer.clipAction(this.animations[12]).play();
      setInterval(this.animatePlane, 30000);
      // CALL ANIMATION FUNCTION
      this.scene.updateMatrixWorld();
      this.animate();
    }, (xhr) => {
      this.percentloaded = Math.ceil(xhr.loaded / xhr.total * 100) + "%";

    })
  }
  randomCar = () => {
    if (this.animationBool) {
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
      else if (this.carint === 4) {
        this.mixer.clipAction(this.animations[9]).play();
        this.mixer.clipAction(this.animations[9]).reset();
      }
      this.carint += 1;
      if (this.carint > 4) {
        this.carint = 0;
      }
    }
  }
  animatePlane = () => {
    this.mixer.clipAction(this.animations[8]).play();
    this.mixer.clipAction(this.animations[8]).reset();
  }
  // UPDATE MOUSEPOSITION FOR RAYCASTING
  onDocumentMouseMove = (event) => {
    // let x = (event.offsetX / canvas.clientWidth) * 2 - 1;
    // let y = -(event.offsetY / canvas.clientHeight) * 2 + 1;

    this.mouse.x = (event.offsetX / this.el.nativeElement.clientWidth) * 2 - 1;
    this.mouse.y = - (event.offsetY / this.el.nativeElement.clientHeight) * 2 + 1;
  }
  onDocumentMouseClick = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // checkrooms
    if (intersects.length > 0) {

      if (intersects[0].object.parent.name === 'medialab') {
        this.disposeEverything();
        this.router.navigate(['/livestream'])


      } else if (intersects[0].object.parent.name === 'fablab') {
        this.disposeEverything();
        this.router.navigate(['/timetable'])

      } else if (intersects[0].object.parent.name === 'conversationroom') {
        this.disposeEverything();
        this.router.navigate(['/network'])

      } else if (intersects[0].object.parent.name === 'entrance') {
        this.disposeEverything();
        this.router.navigate(['/faq'])

      } else if (intersects[0].object.parent.name === 'ehb_logo') {
        window.open('https://www.erasmushogeschool.be/nl/opleidingen/multimedia-communicatietechnologie', '_blank');

      } else {

      }

    }
  }
  disposeEverything = () => {
    // dispose geometries and materials in scene
    this.scene.traverse((o) => {

      if (o.geometry) {
        o.geometry.dispose()

      }

      if (o.material) {
        if (o.material.length) {
          for (let i = 0; i < o.material.length; ++i) {
            o.material[i].dispose()

          }
        }
        else {
          o.material.dispose()

        }
      }
    })
    this.raycaster = null;
    this.scene = null;
    this.camera = null;
    this.renderer && this.renderer.renderLists.dispose();
    this.renderer = null;

  }

  // RESIZE DOCUMENT EVENTLISTENER
  onWindowResize = () => {
    this.camera.aspect = this.el.nativeElement.clientWidth / this.el.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }
  toggleAnimations = () => {
    if (this.animationBool) {
      this.animationBool = false
      this.animationsOn = "OFF"
    } else {
      this.animationBool = true
      this.animationsOn = "ON"
    }
  }
  // ANIMATION
  animate = () => {
    this.animationFrame = requestAnimationFrame(this.animate);
    if (this.animationBool) {
      this.mixer.update(0.03);
    }


    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    // checkrooms
    if (intersects.length > 0) {
      if (intersects[0].object.parent.name === 'medialab') {
        this.medialabMesh.position.y = this.yPos.mediaY + 0.2;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.conversationMesh.position.y = this.yPos.converY;
        // this.entrancemesh.position.y = this.yPos.entranceY
        this.speechmeshes[1].visible = true;
        this.speechmeshes[0].visible = false;
        this.speechmeshes[2].visible = false;
        this.speechmeshes[3].visible = false;
        this.el.nativeElement.style.cursor = "pointer"

      } else if (intersects[0].object.parent.name === 'fablab') {
        this.fablabMesh.position.y = this.yPos.fablabY + 0.2;
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.conversationMesh.position.y = this.yPos.converY;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[0].visible = true;
        this.speechmeshes[2].visible = false;
        this.speechmeshes[3].visible = false;
        this.entrancemesh.position.y = this.yPos.entryY
        this.el.nativeElement.style.cursor = "pointer"
      } else if (intersects[0].object.parent.name === 'conversationroom') {
        this.conversationMesh.position.y = this.yPos.converY + 0.2;
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.entrancemesh.position.y = this.yPos.entryY
        this.speechmeshes[0].visible = false;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[2].visible = true;
        this.speechmeshes[3].visible = false;
        this.el.nativeElement.style.cursor = "pointer"
      } else if (intersects[0].object.parent.name === 'ehb_logo') {
        this.el.nativeElement.style.cursor = "pointer"
      } else if (intersects[0].object.parent.name === 'entrance') {

        this.entrancemesh.position.y = this.yPos.entryY + 0.2
        this.conversationMesh.position.y = this.yPos.converY
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.el.nativeElement.style.cursor = "pointer"
        this.speechmeshes[0].visible = false;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[2].visible = false;
        this.speechmeshes[3].visible = true;

      } else {
        this.entrancemesh.position.y = this.yPos.entryY
        this.medialabMesh.position.y = this.yPos.mediaY;
        this.fablabMesh.position.y = this.yPos.fablabY;
        this.conversationMesh.position.y = this.yPos.converY;
        this.speechmeshes[0].visible = false;
        this.speechmeshes[1].visible = false;
        this.speechmeshes[2].visible = false;
        this.speechmeshes[3].visible = false;
        this.el.nativeElement.style.cursor = "default"
      }

    } else {
      this.medialabMesh.position.y = this.yPos.mediaY;
      this.fablabMesh.position.y = this.yPos.fablabY;
      this.conversationMesh.position.y = this.yPos.converY;
      this.entrancemesh.position.y = this.yPos.entryY
      this.speechmeshes[0].visible = false;
      this.speechmeshes[1].visible = false;
      this.speechmeshes[2].visible = false;
      this.speechmeshes[3].visible = false;
      this.el.nativeElement.style.cursor = "default"
    }
    this.logomesh.rotation.y += 0.005;
    this.textmesh.rotation.z += 0.009;
    this.renderer.render(this.scene, this.camera);

  }


}
