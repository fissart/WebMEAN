import { Component, ElementRef, viewChild, AfterViewInit, OnDestroy, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../../environments/environment';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Navbar } from './navbar';

@Component({
  selector: 'app-child-scene',
  standalone: true,
  imports: [Navbar, CommonModule, MarkdownModule],
  template: `
    <div class="child-container" #container>
      <app-navbar></app-navbar>
      <canvas #childCanvas class="child-canvas" (click)="onCanvasClick($event)"></canvas>
      <div #labelRendererContainer class="label-renderer-container"></div>

      <!-- Bootstrap 5 Modal -->
      @if (selectedNews()) {
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.6);" role="dialog">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ selectedNews().title || 'News Details' }}</h5>
              </div>
              <div class="modal-body">
                <markdown [data]="selectedNews().description || selectedNews().content || 'No details available.'"></markdown>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" (click)="closeModal()">Close</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    .child-container {
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }
    .child-canvas {
      width: 100%;
      height: 100%;
      display: block;
      cursor: pointer;
    }
    .label-renderer-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }
    ::ng-deep .news-label {
      background: rgba(0, 0, 0, 0.75);
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: sans-serif;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      margin-top: -30px;
      transition: opacity 0.2s ease;
    }
    :host ::ng-deep .lil-gui {
      --background-color: rgba(22, 33, 62, 0.9);
      --text-color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      margin-top: calc(60px + 1em);
    }
  `]
})
export class ChildScene implements AfterViewInit, OnDestroy {
  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('childCanvas');
  private containerRef = viewChild.required<ElementRef<HTMLDivElement>>('container');
  private labelRendererContainerRef = viewChild.required<ElementRef<HTMLDivElement>>('labelRendererContainer');

  private ngZone = inject(NgZone);
  private http = inject(HttpClient);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private controls!: OrbitControls;
  private spotLight!: THREE.SpotLight;
  private gui!: GUI;
  private animationFrameId!: number;
  private resizeObserver!: ResizeObserver;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private newsMeshes: THREE.Object3D[] = [];

  selectedNews = signal<any | null>(null);
  newsCount = signal<number>(0);

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.initThree();
      this.fetchNewsAndCreateObjects();

      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef().nativeElement;
    const container = this.containerRef().nativeElement;
    const labelContainer = this.labelRendererContainerRef().nativeElement;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f19);
    this.scene.fog = new THREE.FogExp2(0x0b0f19, 0.035);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(-3, 2, 4);

    // Renderer con ACESFilmicToneMapping para máximo realismo
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // CSS2D Label Renderer
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    labelContainer.appendChild(this.labelRenderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 15;

    // Textures Loader
    const loader = new THREE.TextureLoader().setPath('/');
    const filenames = ['disturb.jpg', 'www1.svg', 'www3.svg'];
    const textures: { [key: string]: THREE.Texture | null } = { none: null };

    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i];
      const texture = loader.load(filename);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      textures[filename] = texture;
    }

    // --- SISTEMA DE ILUMINACIÓN AVANZADA ---

    // 1. Luz Ambiental / Hemisférica de Rebote Suave
    const hemisphereLight = new THREE.HemisphereLight(0xffeedd, 0x1b263b, 0.6);
    this.scene.add(hemisphereLight);

    // 2. Foco Principal Anaranjado Cálido con Sombras Nítidas
    this.spotLight = new THREE.SpotLight(0xfffffff, 980);
    this.spotLight.name = 'spotLight';
    this.spotLight.map = textures['disturb.jpg']!;
    this.spotLight.position.set(4, 8, 4);
    this.spotLight.angle = Math.PI / 5;
    this.spotLight.penumbra = 0.8;
    this.spotLight.decay = 2;
    this.spotLight.distance = 25;

    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.spotLight.shadow.camera.near = 1;
    this.spotLight.shadow.camera.far = 15;
    this.spotLight.shadow.bias = -0.001;
    this.scene.add(this.spotLight);

    // 3. Luz de Contra / Borde (Rim Light azulada para contraste cinematográfico)
    const rimLight = new THREE.DirectionalLight(0x3388ff, 2.5);
    rimLight.position.set(-6, 4, -5);
    this.scene.add(rimLight);

    // 4. Luz Puntual Central para realce de volúmenes metálicos
    const fillLight = new THREE.PointLight(0xffaa55, 30, 10);
    fillLight.position.set(0, 1, 0);
    this.scene.add(fillLight);

    // Helpers
    const slAny = this.spotLight as any;
    slAny.lightHelper = new THREE.SpotLightHelper(this.spotLight);
    slAny.lightHelper.visible = false;
    this.scene.add(slAny.lightHelper);

    slAny.shadowCameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
    slAny.shadowCameraHelper.visible = false;
    this.scene.add(slAny.shadowCameraHelper);

    // Floor Plane
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x070913,
      roughness: 0.7,
      metalness: 0.3
    });
    const floor = new THREE.Mesh(planeGeometry, planeMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.5;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // GUI Setup
    this.setupGUI(slAny, textures);

    // Resize Observer
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
          this.labelRenderer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(container);
  }

  private setupGUI(slAny: any, textures: { [key: string]: THREE.Texture | null }): void {
    this.gui = new GUI();
    const params = {
      map: textures['disturb.jpg'],
      color: this.spotLight.color.getHex(),
      intensity: this.spotLight.intensity,
      distance: this.spotLight.distance,
      angle: this.spotLight.angle,
      penumbra: this.spotLight.penumbra,
      decay: this.spotLight.decay,
      helpers: false
    };

    const folderw = this.gui.addFolder('Iluminación & Texturas');

    folderw.add(params, 'map', textures).onChange((val: any) => {
      this.spotLight.map = val;
    });

    const folder = this.gui.addFolder('Iluminación & Texturas');

    folder.add(params, 'map', textures).onChange((val: any) => {
      this.spotLight.map = val;
    });

    folder.addColor(params, 'color').onChange((val: number) => {
      this.spotLight.color.setHex(val);
    });

    folder.add(params, 'intensity', 0, 1500).onChange((val: number) => {
      this.spotLight.intensity = val;
    });

    folder.add(params, 'angle', 0, Math.PI / 3).onChange((val: number) => {
      this.spotLight.angle = val;
    });

    folder.add(params, 'penumbra', 0, 1).onChange((val: number) => {
      this.spotLight.penumbra = val;
    });

    folder.add(params, 'helpers').onChange((val: boolean) => {
      slAny.lightHelper.visible = val;
      slAny.shadowCameraHelper.visible = val;
    });

    folder.open();
  }

  private fetchNewsAndCreateObjects(): void {
    const loader = new GLTFLoader();

    // Modelo central
    loader.load(
      'new.glb',
      (gltf) => {
        const centerModel = gltf.scene.clone();
        centerModel.position.set(0, 1, 0);
        centerModel.scale.set(4, 4, 4);

        centerModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if ((child as THREE.Mesh).material) {
              const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
              if (material.isMeshStandardMaterial) {
                material.roughness = 0.25;
                material.metalness = 0.5;
              }
            }
          }
        });

        this.scene.add(centerModel);
        this.newsMeshes.push(centerModel);
        this.newsCount.set(this.newsMeshes.length);
      },
      undefined,
      (error) => {
        console.error('Error loading central new.glb model:', error);
      }
    );

    // Modelos alrededor de la escena
    this.http.get<any[]>(`${environment.apiURL}/api/links/news`).subscribe({
      next: (newsItems) => {
        if (!Array.isArray(newsItems)) return;

        loader.load(
          'new.glb',
          (gltf) => {
            const totalItems = newsItems.length;

            newsItems.forEach((news, index) => {
              const modelClone = gltf.scene.clone();

              const angle = (index / totalItems) * Math.PI * 2;
              const radius = 3.5;
              modelClone.position.x = Math.cos(angle) * radius;
              modelClone.position.y = 0;
              modelClone.position.z = Math.sin(angle) * radius;
              modelClone.scale.set(1, 1, 1);

              modelClone.traverse((child) => {
                child.userData = { newsData: news };
                if ((child as THREE.Mesh).isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;

                  if ((child as THREE.Mesh).material) {
                    const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                    if (material.isMeshStandardMaterial) {
                      material.roughness = 0.2;
                      material.metalness = 0.3;
                    }
                  }
                }
              });

              const titleText = news.title || `News ${index + 1}`;
              const p = document.createElement('div');
              p.className = 'news-label';
              p.textContent = titleText;

              const cDiv = new CSS2DObject(p);
              cDiv.position.set(0, 1.2, 0);
              modelClone.add(cDiv);

              this.scene.add(modelClone);
              this.newsMeshes.push(modelClone);
            });
            this.newsCount.set(this.newsMeshes.length);
          },
          undefined,
          (error) => {
            console.error('Error loading surrounding new.glb models:', error);
            this.createFallbackObjects(newsItems);
          }
        );
      },
      error: (err) => {
        console.error('Failed to load news items from API', err);
        const fallbackNews = [{
          title: 'Default News',
          description: 'API could not be reached. **Please check your connection.**'
        }];
        this.createFallbackObjects(fallbackNews);
      }
    });
  }

  private createFallbackObjects(newsItems: any[]): void {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const totalItems = newsItems.length;

    newsItems.forEach((news, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${(index * 360) / totalItems}, 80%, 60%)`),
        roughness: 0.2,
        metalness: 0.2
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const angle = (index / totalItems) * Math.PI * 2;
      const radius = 3.5;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = 0;
      mesh.position.z = Math.sin(angle) * radius;

      mesh.userData = { newsData: news };

      const titleText = news.title || `News ${index + 1}`;
      const p = document.createElement('div');
      p.className = 'news-label';
      p.textContent = titleText;

      const cDiv = new CSS2DObject(p);
      cDiv.position.set(0, 0.8, 0);
      mesh.add(cDiv);

      this.scene.add(mesh);
      this.newsMeshes.push(mesh);
    });
    this.newsCount.set(this.newsMeshes.length);
  }

  public onCanvasClick(event: MouseEvent): void {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.newsMeshes, true);

    if (intersects.length > 0) {
      let currentObj: THREE.Object3D | null = intersects[0].object;
      let newsData = null;

      while (currentObj) {
        if (currentObj.userData && currentObj.userData['newsData']) {
          newsData = currentObj.userData['newsData'];
          break;
        }
        currentObj = currentObj.parent;
      }

      if (newsData) {
        this.ngZone.run(() => {
          this.selectedNews.set(newsData);
        });
      }
    }
  }

  closeModal(): void {
    this.selectedNews.set(null);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    this.newsMeshes.forEach((mesh, index) => {
      mesh.rotation.x += 0.003 * (index + 1);
      mesh.rotation.y += 0.007 * (index + 1);
    });

    const slAny = this.spotLight as any;
    if (slAny.lightHelper) {
      slAny.lightHelper.update();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.gui) {
      this.gui.destroy();
    }
    this.controls?.dispose();
    this.renderer?.dispose();
  }
}
