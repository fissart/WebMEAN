import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Navbar } from './navbar';
import { MarkdownComponent } from 'ngx-markdown';
import { GlbViewerComponent } from './exhibicionchildglb';
import { MathRendererDirective } from './mathrender';

// --- INTERFACES ADAPTADAS A CURADURÍA DE ARTE ---
export interface Appreciation {
  user: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CriticalAnnotation {
  user: string;
  title?: string;
  detail: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CuratorialEssay {
  user: string;
  title?: string;
  detail: string;
  themes: CriticalAnnotation[];
  likes?: Appreciation[];
  unlikes?: Appreciation[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ArtworkCuratorship {
  _id: string;
  title: string;
  type: string;
  user: string;
  email: string;
  audioEsUrl?: string; // Audio en Español
  audioQuUrl?: string; // Audio en Quechua
  imageUrl?: string;
  curator: string;
  detail: string; // Ficha técnica, texto curatorial e imagen
  usser?: { email: string; _id: string; name: string; curator?: string; detail?: string }[];
  likes?: Appreciation[];
  unlikes?: Appreciation[];
  units?: CuratorialEssay[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Usser {
  _id?: string;
  name: string;
  filosophy: string;
  email: string;
  dni?: string;
  cell?: string;
  celular?: string;
  foto?: string;
  about?: string;
}

export function isAuth(): any {
  const authData = localStorage.getItem('user');
  return authData ? JSON.parse(authData) : null;
}

@Component({
  selector: 'app-art-curatorship',
  standalone: true,
  imports: [
    MarkdownComponent,
    CommonModule,
    FormsModule,
    CKEditorModule,
    Navbar,
    MathRendererDirective,
    GlbViewerComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="py-5"></div>

    <div class="min-vh-100 pb-5 pt-4">
      <div class="container my-4" style="max-width: 1080px;">

      <!-- Tarjeta de Información del Usuario/Curador (USSER) -->
        @if (usser(); as userProfile) {
          <div class="card border-0 shadow-lg mb-4 border-left border-info" style="border-left-width: 4px !important;">
            <div class="card-body p-4 border rounded">
              <div class="align-items-center mb-3">
                <div class="text-center mb-3">
                  @if (userProfile.foto) {
                    <img
                      class="rounded-circle border-info shadow-sm object-fit-cover-style"
                      [src]="getPerfilImageUrl(userProfile.foto)"
                      [alt]="userProfile.name || 'Foto del usuario'"
                      style="width: 194px; height: 194px; object-fit: cover;"
                    />
                  } @else {
                    <div class="rounded-circle bg-info text-dark d-inline-flex align-items-center justify-content-center font-weight-bold shadow-sm" style="width: 54px; height: 54px; font-size: 22px;">
                      {{ getInitial(userProfile.name || userProfile.email) }}
                    </div>
                  }
                </div>

                <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between">
                  <div>
                    <h4 class="font-weight-bold mb-0">Curador: {{ userProfile.name }}</h4>
                    <small class="text-info">{{ userProfile.email }}</small>
                    @if (userProfile.cell || userProfile.celular) {
                      <small class=" mt-1"><strong>Teléfono:</strong> {{ userProfile.cell || userProfile.celular }}</small>
                    }
                  </div>

                  @if (userProfile.cell || userProfile.celular) {
                    <div class="btn-group mt-3 mt-sm-0" role="group">
                      <a
                        [href]="'tel:' + (userProfile.cell || userProfile.celular)"
                        class="btn btn-info"
                        title="Llamar"
                      >
                        <i class="bi bi-telephone-fill"></i>
                      </a>
                      <button
                        type="button"
                        class="btn btn-success"
                        title="WhatsApp"
                        (click)="sendWhatsAppMessage(userProfile.cell || userProfile.celular, userProfile.name)"
                      >
                        <i class="bi bi-whatsapp"></i>
                      </button>
                    </div>
                  }
                </div>

                @if (userProfile.filosophy) {
                  <div class="col-12 mt-3 pt-3 border-top border-secondary  px-0">
                    <strong class="text-info">Sobre el curador/usuario:</strong>
                    <div [appMathRenderer]="userProfile.filosophy"></div>
                  </div>
                }
              </div>
            </div>
          </div>
          
          <!-- Banner Superior Galería -->
          <div class="card border-0 shadow-lg mb-4 bg-gradient-dark border-left border-warning" style="border-left-width: 4px !important;">
            <div class="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div class="mb-3 mb-md-0">
                <div class="d-flex align-items-center mb-2">
                  <h2 class="font-weight-bold mb-0 text-uppercase tracking-wider">Curaduría & Galería de Arte</h2>
                </div>
                <p class="text-secondary mb-0">
                  Espacio de exhibición, análisis crítico y debate sobre colecciones visuales de {{userProfile.name}}.
                </p>
              </div> 
              @if ((userSession() && this.userparams === userSession()?._id) || userSession()?.rol === '1') {
                <button
                  class="btn btn-warning"
                  (click)="openModal('1', 'Publicar Nueva Obra')"
                >
                  <i class="bi bi-plus-lg mr-1"></i> Nueva obra
                </button>
              }
            </div>
          </div>
        }
      
        <!-- Feed de Muestras Curadas -->
        <div class="d-flex flex-column gap-4">
          @for (artwork of artworkExhibits(); track artwork._id || $index; let i = $index) {
            <article class="card bg-secondary-dark  border-0 shadow-lg overflow-hidden">
              <div class="card-body p-4 p-md-5">

                <!-- Cabecera de la Obra / Curador -->
                <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-warning text-dark d-inline-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0" style="width: 46px; height: 46px; font-size: 18px;">
                      {{ getInitial(artwork.curator || artwork.email) }}
                    </div>
                    <div class="ms-3">
                      <small>
                        Exhibido el {{ formatDate(artwork.createdAt) }}
                      </small>
                    </div>
                  </div>
                  @if (userSession()?._id === artwork.user) {
                    <div class="btn-group" role="group">
                      <button
                        class="btn btn-sm btn-outline-light border-0 rounded-circle me-1"
                        title="Editar Muestra"
                        (click)="openModal('1w', 'Actualizar Obra/Muestra', artwork.title, artwork.detail, { i, j: -1, k: -1 }, artwork._id)"
                      >
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger border-0 rounded-circle"
                        title="Eliminar de Galería"
                        (click)="removeTheme(artwork._id)"
                      >
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  }
                </div>

                <!-- Título y Vista Preview de la Imagen -->
                <h3 class="fw-bold mb-3 text-uppercase font-serif">{{ artwork.title }}</h3>
                @if (artwork.imageUrl) {
                  <div class="card-image-wrapper position-relative mb-3 overflow-hidden rounded">
                    @if (artwork.imageUrl.endsWith('.glb') || artwork.imageUrl.endsWith('.gltf') || artwork.imageUrl.endsWith('.obj')) {
                      <app-glb-viewer [glbSource]="getImageUrl(artwork.imageUrl)"></app-glb-viewer>
                    } @else {
                      <img [src]="getImageUrl(artwork.imageUrl)" [alt]="artwork.title" class="img-fluid w-100 object-fit-cover" style="max-height: 450px;" />
                    }
                  </div>
                }

                @if (artwork.audioEsUrl || artwork.audioQuUrl) {
                  <div class="p-3 bg-dark border border-secondary rounded mb-3">
                    <small class="fw-bold text-warning text-uppercase mb-2">
                      <i class="bi bi-volume-up-fill me-1"></i> Audioguía de la Muestra
                    </small>
                    
                    <div class="row g-2">
                      @if (artwork.audioEsUrl) {
                        <div class="col-md-6">
                          <div class="d-flex align-items-center bg-secondary-dark p-2 rounded">
                            <span class="badge bg-warning text-dark me-2">ES</span>
                            <audio controls class="w-100" style="height: 32px;" [src]="getImageUrl(artwork.audioEsUrl)"></audio>
                          </div>
                        </div>
                      }

                      @if (artwork.audioQuUrl) {
                        <div class="col-md-6">
                          <div class="d-flex align-items-center bg-secondary-dark p-2 rounded">
                            <span class="badge bg-info text-dark me-2">QU</span>
                            <audio controls class="w-100" style="height: 32px;" [src]="getImageUrl(artwork.audioQuUrl)"></audio>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Texto Curatorial -->
                <div class="artwork-markdown-container mb-4">
                  <markdown [katex]="true" [data]="artwork.detail"></markdown>
                </div>

                <!-- Barra de Interacción Crítica -->
                <div class="d-flex align-items-center pt-3 border-top border-secondary">
                  <div class="btn-group p-1 me-auto" role="group">
                    <button
                      class="btn btn-sm btn-outline-warning rounded-0 px-3 border-0 d-flex align-items-center me-1"
                      title="Apreciación Favorable"
                      (click)="handleLike(i, artwork._id, 'like')"
                    >
                      <i class="bi bi-award-fill me-1"></i>
                      <span class="fw-bold fst-italic small">{{ artwork.likes?.length || 0 }}</span>
                    </button>

                    <button
                      class="btn btn-sm btn-outline-secondary rounded-0 px-3 border-0 d-flex align-items-center"
                      title="En Revisión"
                      (click)="handleLike(i, artwork._id, 'unlike')"
                    >
                      <i class="bi bi-award me-1"></i>
                      <span class="fw-bold fst-italic small">{{ artwork.unlikes?.length || 0 }}</span>
                    </button>
                  </div>

                  <button
                    class="btn btn-sm btn-outline-warning rounded-0 px-3 py-2 d-flex align-items-center fw-bold text-uppercase"
                    (click)="openModal('2', 'Redactar Ensayo Crítico', '', '', { i, j: -1, k: -1 }, artwork._id)"
                  >
                    <i class="bi bi-journal-text me-2 fs-5"></i>
                    <span>Ensayos Críticos ({{ artwork.units?.length || 0 }})</span>
                  </button>
                </div>

                <!-- Ensayos Críticos (Nivel 2) -->
                @if (artwork.units && artwork.units.length > 0) {
                  <div class="mt-4 pt-4 border-start border-3 border-warning rounded-0 p-3 p-md-4 ms-md-2"> 
                    <div class="d-flex align-items-center text-warning fw-bold small text-uppercase mb-3 tracking-wider">
                      <i class="bi bi-vector-pen me-2 fs-5"></i>
                      <span>Críticas & Análisis Ensayísticos ({{ artwork.units.length }})</span>
                    </div>

                    @for (essay of artwork.units; track $index; let j = $index) {
                      <div class="mb-4 pb-3 border-bottom border-secondary">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-secondary text-warning d-inline-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0" style="width: 36px; height: 36px; font-size: 14px;">
                              {{ getInitial(essay.user) }}
                            </div>
                            <div class="ms-2">
                              <span class="fw-bold  small mb-0">{{ essay.user }}</span>
                              <small class="text-muted" style="font-size: 0.75rem;">
                                Crítica redactada el {{ formatDate(essay.createdAt) }}
                              </small>
                            </div>
                          </div>

                          @if (userSession()?.email === essay.user || userSession()?.rol === '1') {
                            <div class="btn-group">
                              <button
                                class="btn btn-sm btn-link text-muted p-1"
                                (click)="openModal('2w', 'Actualizar Ensayo', essay.title || '', essay.detail, { i, j, k: -1 }, artwork._id)"
                              >
                                <i class="bi bi-pencil-fill"></i>
                              </button>
                              <button
                                class="btn btn-sm btn-link text-danger p-1"
                                (click)="removeSubTheme(i, j, artwork._id)"
                              >
                                <i class="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          }
                        </div>

                        <div class="ms-4 ps-1 ">
                          <markdown [katex]="true" [data]="essay.detail"></markdown>
                        </div>

                        <!-- Reacciones de Ensayos -->
                        <div class="d-flex align-items-center ms-4 ps-1 mt-2">
                          <button
                            class="btn btn-link text-warning p-0 border-0 d-flex align-items-center small text-decoration-none me-3"
                            (click)="handleSubLike(i, j, artwork._id, 'like')"
                          >
                            <i class="bi bi-star-fill me-1"></i> {{ essay.likes?.length || 0 }}
                          </button>

                          <button
                            class="btn btn-link text-secondary p-0 border-0 d-flex align-items-center small text-decoration-none me-3"
                            (click)="handleSubLike(i, j, artwork._id, 'unlike')"
                          >
                            <i class="bi bi-star me-1"></i> {{ essay.unlikes?.length || 0 }}
                          </button>

                          <button
                            class="btn btn-link p-0 text-warning small fw-bold ms-auto text-decoration-none text-uppercase"
                            (click)="openModal('3', 'Añadir Anotación', '', '', { i, j, k: -1 }, artwork._id)"
                          >
                            Añadir Anotación
                          </button>
                        </div>

                        <!-- Anotaciones Al Pie (Nivel 3) -->
                        @if (essay.themes && essay.themes.length > 0) {
                          <div class="mt-3 ms-4 ps-3 border-start border-secondary">
                            @for (annotation of essay.themes; track $index; let k = $index) {
                              <div class="p-3 bg-dark rounded-0 my-2 border border-secondary shadow-sm">
                                <div class="d-flex align-items-center mb-2">
                                  <div class="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center fw-bold flex-shrink-0" style="width: 28px; height: 28px; font-size: 11px;">
                                    {{ getInitial(annotation.user) }}
                                  </div>
                                  <div class="ms-2">
                                    <span class="fw-bold  small mb-0">{{ annotation.user }}</span>
                                    <small class="text-muted" style="font-size: 0.75rem;">
                                      {{ formatDate(annotation.createdAt) }}
                                    </small>
                                  </div>
                                </div>
                                <div class="small ">
                                  <markdown [katex]="true" [data]="annotation.detail"></markdown>
                                </div>

                                @if (userSession()?.email === annotation.user) {
                                  <div class="d-flex justify-content-end mt-1">
                                    <button
                                      class="btn btn-sm btn-link text-muted p-0 me-2"
                                      (click)="openModal('3w', 'Editar Anotación', annotation.title || '', annotation.detail, { i, j, k }, artwork._id)"
                                    >
                                      <i class="bi bi-pencil-fill"></i>
                                    </button>
                                    <button
                                      class="btn btn-sm btn-link text-danger p-0"
                                      (click)="removeSubSubTheme(i, j, k, artwork._id)"
                                    >
                                      <i class="bi bi-trash-fill"></i>
                                    </button>
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        }

                      </div>
                    }
                  </div>
                }

              </div>
            </article>
          }
        </div>
      </div>

      <!-- Modal de Formulario de Curaduría Mejorado -->
      @if (showModal()) {
        <div class="modal-backdrop-custom">
          <div class="modal-card-custom shadow-lg">
            <div class="modal-header border-secondary px-4 py-3 bg-dark rounded-top">
              <h5 class="modal-title fw-bold text-warning mb-0 text-uppercase tracking-wide">
                <i class="bi bi-journal-arrow-up me-2"></i>{{ submitLabel() }}
              </h5>
              <button type="button" class="btn btn-info" aria-label="Cerrar" (click)="closeModal()">Cerrar</button>
            </div>

            <div class="modal-body p-4 overflow-y-auto" style="max-height: 75vh;">
              @if (modalOption() === '1' || modalOption() === '1w') {
                <div class="mb-3">
                  <label class="fw-bold small text-warning form-label text-uppercase">Título de la Muestra / Obra</label>
                  <input
                    type="text"
                    class="form-control bg-secondary-dark border-secondary shadow-none"
                    placeholder="Ej: El Claroscuro en el Arte Barroco..."
                    [(ngModel)]="formTitle"
                  />
                </div>

                <!-- CONTROL DE CARGA DE ARCHIVOS -->
                <div class="mb-3">
                  <label class="fw-bold small text-warning form-label text-uppercase">Adjuntar Archivo / Imagen de la Obra</label>
                  <input
                    type="file"
                    class="form-control bg-secondary-dark border-secondary shadow-none"
                    [disabled]="isUploading()"
                    (change)="onFileSelected($event)"
                  />
                  @if (selectedFile) {
                    <small class="text-warning mt-1 d-block">
                      <i class="bi bi-paperclip me-1"></i>
                      Archivo seleccionado: <strong>{{ selectedFile.name }}</strong> ({{ (selectedFile.size / 1024).toFixed(1) }} KB)
                    </small>
                  }
                </div>
                
                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="fw-bold small text-warning form-label text-uppercase">
                      <i class="bi bi-mic-fill me-1"></i> Audio en Español (MP3/WAV)
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      class="form-control bg-secondary-dark border-secondary shadow-none"
                      [disabled]="isUploading()"
                      (change)="onAudioEsSelected($event)"
                    />
                    @if (selectedAudioEs) {
                      <small class="text-info mt-1 d-block text-truncate">
                        <i class="bi bi-music-note me-1"></i> {{ selectedAudioEs.name }}
                      </small>
                    }
                  </div>

                  <div class="col-md-6">
                    <label class="fw-bold small text-warning form-label text-uppercase">
                      <i class="bi bi-mic-fill me-1"></i> Audio en Quechua (MP3/WAV)
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      class="form-control bg-secondary-dark border-secondary shadow-none"
                      [disabled]="isUploading()"
                      (change)="onAudioQuSelected($event)"
                    />
                    @if (selectedAudioQu) {
                      <small class="text-info mt-1 d-block text-truncate">
                        <i class="bi bi-music-note me-1"></i> {{ selectedAudioQu.name }}
                      </small>
                    }
                  </div>
                </div>
              }

              <div class="mb-3">
                <label class="fw-bold small text-warning form-label text-uppercase">Texto Curatorial / Ficha Técnica</label>
                <div class="border border-secondary rounded overflow-hidden bg-white text-dark">
                  <ckeditor
                    [editor]="Editor"
                    [config]="editorConfig"
                    [(ngModel)]="formDetail"
                  ></ckeditor>
                </div>
              </div>

              <!-- Barra de Progreso de Carga -->
              @if (isUploading()) {
                <div class="mt-3">
                  <div class="d-flex justify-content-between text-warning small mb-1 fw-bold">
                    <span>Subiendo archivo...</span>
                    <span>{{ uploadProgress() }}%</span>
                  </div>
                  <div class="progress rounded-0 bg-secondary" style="height: 10px;">
                    <div
                      class="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      [style.width.%]="uploadProgress()"
                      [attr.aria-valuenow]="uploadProgress()"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              }
            </div>

            <div class="modal-footer border-secondary px-4 py-3 bg-dark rounded-bottom">
              <button
                type="button"
                class="btn btn-outline-secondary rounded-0 px-4"
                [disabled]="isUploading()"
                (click)="closeModal()"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                class="btn btn-warning rounded-0 px-4 fw-bold text-uppercase"
                [disabled]="isUploading()"
                (click)="handleModalSubmit()"
              >
                @if (isUploading()) {
                  <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  Subiendo...
                } @else {
                  Guardar en Galería
                }
              </button>
            </div>

          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .modal-backdrop-custom {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1050;
      padding: 1rem;
    }
    .modal-card-custom {
      background-color: #1e293b;
      border-radius: 12px;
      width: 100%;
      max-width: 680px;
      border: 1px solid #475569;
      overflow: hidden;
      animation: modalFadeIn 0.25s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ArtCuratorshipComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  public Editor: any = ClassicEditor;
  public editorConfig = {
    language: 'es',
    placeholder: 'Escribe el análisis o ficha técnica...',
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'blockQuote', 'insertTable', 'undo', 'redo'
    ]
  };

  private readonly COURSE_ID = '69e5631506598f7ce9c31e21';
  private currentWorksParam = '';
  public userparams = '';

  artworkExhibits = signal<ArtworkCuratorship[]>([]);
  showModal = signal<boolean>(false);
  modalOption = signal<string>('');
  submitLabel = signal<string>('Publicar');
  activeId = signal<string>('');
  activeIndices = signal<{ i: number; j: number; k: number }>({ i: -1, j: -1, k: -1 });

  formTitle = '';
  formDetail = '';
  usser = signal<Usser | null>(null);

  uploadProgress = signal<number>(0);
  isUploading = signal<boolean>(false);
  selectedFile: File | null = null;
  selectedAudioEs: File | null = null;
  selectedAudioQu: File | null = null;

  userSession = computed(() => isAuth());

  ngOnInit(): void {
    document.title = `CURADURÍA DE ARTE | ${environment.title || ''}`;

    this.route.params.subscribe((params: Params) => {
      this.currentWorksParam = params['id'];
      this.userparams = params['user'];
      if (this.currentWorksParam) {
        this.getNotes(this.currentWorksParam);
      }
    });
    if (this.userparams) {
      this.getUsser(this.userparams);
    }
  }

  getUsser(emailParam: string): void {
    this.http.get<Usser>(`${environment.apiURL}/api/users/userrfree/${emailParam}`).subscribe({
      next: (data) => {
        this.usser.set(data || null);
      },
      error: (err) => console.error('Error al obtener usuario:', err)
    });
  }

  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return '';
    return imageUrl.startsWith('http') ? imageUrl : `${environment.apiURL}/${imageUrl}`;
  }

  onAudioEsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioEs = input.files[0];
    }
  }

  onAudioQuSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioQu = input.files[0];
    }
  }

  sendWhatsAppMessage(phone?: string, name?: string): void {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=Hola%20${encodeURIComponent(name || '')},%20me%20comunico%20desde%20la%20Galería%20de%20Arte.`;
    window.open(url, '_blank');
  }

  getPerfilImageUrl(imageUrl?: string): string {
    if (!imageUrl) return '';
    return imageUrl.startsWith('http') ? imageUrl : `${environment.apiURL}/collections/${imageUrl}`;
  }

  private getNotes(worksParam: string): void {
    this.http.get<ArtworkCuratorship[]>(`${environment.apiURL}/api/exhibitiones/${worksParam}`).subscribe({
      next: (data) => {
        this.artworkExhibits.set(data || []);
      },
      error: (err) => {
        console.error('Error al obtener la galería:', err);
        this.toastr.error('Error al cargar la galería de muestras');
      }
    });
  }

  openModal(
    option: string,
    submitText: string,
    title = '',
    detail = '',
    indices = { i: -1, j: -1, k: -1 },
    id = ''
  ): void {
    if (!this.userSession()) {
      this.router.navigate(['/login']);
      return;
    }
    this.modalOption.set(option);
    this.submitLabel.set(submitText);
    this.formTitle = title;
    this.formDetail = detail;
    this.activeIndices.set(indices);
    this.activeId.set(id);
    this.showModal.set(true);
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
  }

  closeModal(): void {
    this.showModal.set(false);
    this.formTitle = '';
    this.formDetail = '';
    this.selectedAudioEs = null;
    this.selectedAudioQu = null;
    this.selectedFile = null;
    this.uploadProgress.set(0);
  }

  handleModalSubmit(): void {
    switch (this.modalOption()) {
      case '1': this.createTheme(); break;
      case '1w': this.updateTheme(); break;
      case '2': this.createSubTheme(); break;
      case '2w': this.updateSubTheme(); break;
      case '3': this.createSubSubTheme(); break;
      case '3w': this.updateSubSubTheme(); break;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createTheme(): void {
    const user = this.userSession();
    if (!user) return;

    const formData = new FormData();
    formData.append('title', this.formTitle || '');
    formData.append('detail', this.formDetail || '');
    formData.append('type', 'foroesfa');
    formData.append('curse', this.COURSE_ID);
    formData.append('user', user._id || '');
    formData.append('curator', user.name || '');
    formData.append('email', user.email || '');
    formData.append('parent', this.currentWorksParam || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.selectedAudioEs) {
      formData.append('audioEs', this.selectedAudioEs);
    }
    if (this.selectedAudioQu) {
      formData.append('audioQu', this.selectedAudioQu);
    }

    const req = new HttpRequest(
      'POST',
      `${environment.apiURL}/api/exhibitions`,
      formData,
      { reportProgress: true }
    );

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.http.request(req).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            this.uploadProgress.set(percentDone);
          }
        } else if (event instanceof HttpResponse) {
          this.isUploading.set(false);
          this.uploadProgress.set(0);

          if (this.currentWorksParam) {
            this.getNotes(this.currentWorksParam);
          }
          this.closeModal();
          this.toastr.success('Muestra enviada con éxito');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.uploadProgress.set(0);

        let errorMessage = 'Error al subir el archivo';
        if (err.error && err.error.error) {
          errorMessage = err.error.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          errorMessage = err.error;
        }

        this.toastr.error(errorMessage, 'Error de Servidor');
        console.error('Detalle del error:', err);
      }
    });
  }

  updateTheme(): void {
    const user = this.userSession();
    if (!user) return;

    const formData = new FormData();
    formData.append('title', this.formTitle || '');
    formData.append('detail', this.formDetail || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.selectedAudioEs) {
      formData.append('audioEs', this.selectedAudioEs);
    }
    if (this.selectedAudioQu) {
      formData.append('audioQu', this.selectedAudioQu);
    }

    const req = new HttpRequest(
      'PUT',
      `${environment.apiURL}/api/exhibitions/${this.activeId()}`,
      formData,
      { reportProgress: true }
    );

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.http.request(req).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            this.uploadProgress.set(percentDone);
          }
        } else if (event instanceof HttpResponse) {
          this.isUploading.set(false);
          this.uploadProgress.set(0);

          if (this.currentWorksParam) {
            this.getNotes(this.currentWorksParam);
          }
          this.closeModal();
          this.toastr.info('Muestra de arte actualizada con éxito');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.uploadProgress.set(0);

        let errorMessage = 'Error al actualizar la muestra';
        if (err.error && err.error.error) {
          errorMessage = err.error.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }

        this.toastr.error(errorMessage, 'Error al actualizar');
        console.error('Error al actualizar la muestra:', err);
      }
    });
  }

  removeTheme(themeId: string): void {
    if (confirm('¿Deseas retirar esta obra/muestra de la galería?')) {
      this.http.delete(`${environment.apiURL}/api/exhibitions/${themeId}`).subscribe({
        next: () => {
          if (this.currentWorksParam) {
            this.getNotes(this.currentWorksParam);
          }
          this.toastr.info('Muestra retirada');
        },
        error: () => this.toastr.error('Error al retirar')
      });
    }
  }

  private saveLikesChanges(updatedData: ArtworkCuratorship[], targetId: string, index: number): void {
    this.http.put(`${environment.apiURL}/api/exhibitions/${targetId}`, updatedData[index]).subscribe();
  }

  private saveSubThemeChanges(updatedData: ArtworkCuratorship[]): void {
    const { i } = this.activeIndices();
    this.http.put(`${environment.apiURL}/api/exhibitions/${this.activeId()}`, updatedData[i]).subscribe({
      next: () => {
        this.closeModal();
        this.toastr.success('Análisis registrado');
      },
      error: () => this.toastr.error('Error al registrar ensayo')
    });
  }

  handleLike(i: number, targetId: string, type: 'like' | 'unlike'): void {
    const user = this.userSession();
    if (!user) return void this.router.navigate(['/login']);

    const data = structuredClone(this.artworkExhibits());
    const targetArray = type === 'like' ? 'likes' : 'unlikes';

    if (!data[i][targetArray]) data[i][targetArray] = [];

    const hasAppreciation = data[i][targetArray]?.some(u => u.user === user.email);

    if (hasAppreciation) {
      this.toastr.warning('Ya has registrado tu apreciación para esta obra');
    } else {
      data[i][targetArray]?.unshift({
        user: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      this.artworkExhibits.set(data);
      this.saveLikesChanges(data, targetId, i);
    }
  }

  handleSubLike(i: number, j: number, targetId: string, type: 'like' | 'unlike'): void {
    const user = this.userSession();
    if (!user) return void this.router.navigate(['/login']);

    const data = structuredClone(this.artworkExhibits());
    const targetArray = type === 'like' ? 'likes' : 'unlikes';

    if (!data[i].units![j][targetArray]) data[i].units![j][targetArray] = [];

    const hasAppreciation = data[i].units![j][targetArray]?.some(u => u.user === user.email);

    if (hasAppreciation) {
      this.toastr.warning('Ya has valorado este ensayo crítico');
    } else {
      data[i].units![j][targetArray]?.unshift({
        user: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      this.artworkExhibits.set(data);
      this.saveLikesChanges(data, targetId, i);
    }
  }

  createSubTheme(): void {
    const user = this.userSession();
    if (!user) return void this.router.navigate(['/login']);

    const { i } = this.activeIndices();
    const data = structuredClone(this.artworkExhibits());

    if (!data[i].units) data[i].units = [];
    data[i].units!.unshift({
      user: user.email,
      title: this.formTitle,
      detail: this.formDetail,
      themes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.artworkExhibits.set(data);
    this.saveSubThemeChanges(data);
  }

  updateSubTheme(): void {
    const { i, j } = this.activeIndices();
    const data = structuredClone(this.artworkExhibits());

    data[i].units![j].title = this.formTitle;
    data[i].units![j].detail = this.formDetail;
    data[i].units![j].updatedAt = new Date();

    this.artworkExhibits.set(data);
    this.saveSubThemeChanges(data);
  }

  removeSubTheme(i: number, j: number, targetId: string): void {
    if (confirm('¿Deseas eliminar este ensayo crítico?')) {
      const data = structuredClone(this.artworkExhibits());
      data[i].units!.splice(j, 1);
      this.artworkExhibits.set(data);

      this.http.put(`${environment.apiURL}/api/exhibitions/${targetId}`, data[i]).subscribe({
        next: () => this.toastr.info('Ensayo eliminado'),
        error: (err) => console.error(err)
      });
    }
  }

  createSubSubTheme(): void {
    const user = this.userSession();
    if (!user) return void this.router.navigate(['/login']);

    const { i, j } = this.activeIndices();
    const data = structuredClone(this.artworkExhibits());

    data[i].units![j].themes.unshift({
      user: user.email,
      title: this.formTitle,
      detail: this.formDetail,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.artworkExhibits.set(data);
    this.saveSubThemeChanges(data);
  }

  updateSubSubTheme(): void {
    const { i, j, k } = this.activeIndices();
    const data = structuredClone(this.artworkExhibits());

    data[i].units![j].themes[k].title = this.formTitle;
    data[i].units![j].themes[k].detail = this.formDetail;
    data[i].units![j].themes[k].updatedAt = new Date();

    this.artworkExhibits.set(data);
    this.saveSubThemeChanges(data);
  }

  removeSubSubTheme(i: number, j: number, k: number, targetId: string): void {
    if (confirm('¿Deseas eliminar esta anotación?')) {
      const data = structuredClone(this.artworkExhibits());
      data[i].units![j].themes.splice(k, 1);
      this.artworkExhibits.set(data);

      this.http.put(`${environment.apiURL}/api/exhibitions/${targetId}`, data[i]).subscribe({
        next: () => this.toastr.info('Anotación eliminada'),
        error: (err) => console.error(err)
      });
    }
  }

  getInitial(emailOrName?: string): string {
    return emailOrName ? emailOrName.charAt(0).toUpperCase() : 'C';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
