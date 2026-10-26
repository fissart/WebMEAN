import {
  Component,
  OnInit,
  OnDestroy,
  WritableSignal,
  signal,
  inject,
  Pipe,
  PipeTransform,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import * as timeago from 'timeago.js';
import es from 'timeago.js/lib/lang/es';
import { Navbar } from './navbar';
import { environment } from '../../environments/environment';
import { ExportToPdfComponent } from './notasstdpdf';
import { ExportTohtmlComponent } from './notashtml';
import { AdminStudentManagerComponent } from './users';
import { ExportToExcelComponent } from './notasexcel';
import { UserLoaderComponent } from './userget'; // Ajusta la ruta de importación

timeago.register('es', es);

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return timeago.format(date, 'es');
  }
}

export interface User {
  _id: string;
  name: string;
  email: string;
  rol: string;
  mencion?: string;
  ciclo?: string;
  tipostd?: string;
  dni?: string;
  dateb?: string;
  datee?: string;
}

export interface Curse {
  _id: string;
  title: string;
  description?: string;
  mencion?: string;
  credito?: string;
  ciclo?: string;
  codigo?: string;
  img?: string;
}

export interface CurseGroup {
  _id: string;
  records: Curse[];
}

export interface GeneratedCurse {
  curses: Curse[];
}

export interface ConvalidateRecord {
  _id: string;
  username: string;
  useremail: string;
  title: string;
  mencion: string;
  ciclo: string;
}

@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [
    ExportToExcelComponent,
    AdminStudentManagerComponent,
    ExportToPdfComponent,
    ExportTohtmlComponent,
    Navbar,
    CommonModule,
    FormsModule,
    RouterModule,
    TimeAgoPipe,
    UserLoaderComponent
  ],
  template: `
    <!-- Contenedor Toast / Notificaciones -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 10850;">
      @for (toast of toasts(); track $index) {
        <div class="toast show align-items-center text-white border-0 mb-2" [ngClass]="toast.bgClass" role="alert">
          <div class="d-flex">
            <div class="toast-body">{{ toast.message }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="removeToast($index)"></button>
          </div>
        </div>
      }
    </div>

    <!-- Modal Bootstrap -->
    @if (showModal()) {
      <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header fw-bold">
              <h5 class="modal-title">{{ submit() }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              @if (!convalidate()) {
                @if (option() === '1' || option() === '3') {
                  <div class="justify-content-center align-items-center p-1">
                    @for (group of cursesSource(); track group._id) {
                      <div class="p-1">
                        <div class="text-center border-warning border-bottom border-3 my-1 text-warning fw-bold w-100">
                          {{ group._id }}
                        </div>
                        <div class="row justify-content-center align-items-center p-1">
                          @for (curse of group.records; track curse._id) {
                            <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4 p-1">
                              <button class="btn btn-info w-100" (click)="handleSelectSourceCurse(curse)">
                                {{ curse.title }} <span class="text-dark">[{{ curse.mencion }} {{ curse.ciclo }}]</span>
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="card form-group mb-2">
                    <div class="p-2 fw-bold">Nombre</div>
                    <input type="text" class="form-control" placeholder="Nombre" [(ngModel)]="title" required />
                  </div>
                  <div class="card form-group mb-2">
                    <div class="p-2 fw-bold">Contenido</div>
                    <textarea class="form-control border-0 rounded-0" placeholder="Contenido" rows="2" [(ngModel)]="description" required></textarea>
                  </div>
                  <input type="file" #fileInputRef class="form-control d-none" (change)="onFileSelected($event)" />
                  <img
                    class="img-fluid style-preview cursor-pointer"
                    [src]="photoSelected() || (apiUrl + '/collections/' + foto())"
                    alt="Vista previa"
                    (click)="triggerFileInput()"
                    (error)="handleImageError($event)"
                    style="max-height: 250px; object-fit: cover; cursor: pointer;"
                  />
                }
              } @else {
                <div>
                  <p>{{ option() }} | Crédito: {{ credito() }} | Ciclo: {{ ciclo() }} | Mención: {{ mencion() }} | Código: {{ codigo() }} | ID: {{ curseid() }} | {{ title() }}</p>
                  <input type="text" class="form-control" placeholder="Nota" [(ngModel)]="nota" required />
                </div>
              }
            </div>
            <div class="modal-footer">
              @if (option() === '2') {
                <button class="btn btn-info" (click)="curseUpdate()">Actualizar curso</button>
              }
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-navbar></app-navbar>  
    <div class="py-5"></div>
<app-user-loader 
      (userUpdated)="handleUserUpdated($event)" 
      (onError)="handleError($event)">
    </app-user-loader>
    <!-- Contenido Principal -->
    <div class="container">
      <div class="p-1 my-1 text-center ffont h3">
        <span>{{ activeUser()?.name }}</span><br />
        <span class="h5">{{ activeUser()?.email }}</span>
      </div>

      <!-- Cuadrícula de Cursos Generados -->
      <div class="row justify-content-center align-items-center mb-3 p-1">
        @for (item of generatedCurses(); track $index) {
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
            <div class="p-1 rounded contenedor position-relative">
              <img
                class="image rounded img-fluid"
                [src]="apiUrlfile + '/collections/' + item.curses[0]?.img"
                alt="Curso"
                (error)="handleImageError($event)"
              />
              <div class="overlay-text p-2">
                <div class="text-center ffont h5">
                  {{ item.curses[0]?.title }} {{ item.curses[0]?.credito }}
                </div>
                <div class="btn-group w-100">
                  <button
                    class="btn btn-warning w-100"
                    (click)="navigateToCourse(item.curses[0])"
                  >
                    Abrir Curso
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Panel de Administración (Rol == '1') -->
      @if (activeUser()?.rol === '1') {
        <div class="text-center">
          <div class="text-center rounded p-1 mt-1 bg-light">
            <button type="button" class="btn btn-warning text-uppercase" (click)="router.navigate(['/adicionarusuario'])">
              Integrar usuario nuevo
            </button>            
            <div class="row justify-content-center align-items-center">
              @for (message of stdsConvalidate(); track message._id) {
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                  <div class="p-1 rounded border mb-1">
                    {{ message.username }} {{ message.useremail }} {{ message.title }} [{{ message.mencion }}] [{{ message.ciclo }}]
                    <button type="button" class="btn btn-danger btn-sm w-100 mt-1">
                      Eliminar
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Ajustes de Fecha -->
            <div class="row p-2 d-flex justify-content-center align-items-center">
              <div class="col-md-6 p-1 text-center">
                Inicia {{ activeUser()?.dateb | timeAgo }}<br />
                <input
                  type="datetime-local"
                  class="btn btn-info w-100"
                  [ngModel]="formatDateForInput(activeUser()?.dateb)"
                  (ngModelChange)="updateLimitGetAverage($event, 'dateb')"
                />
              </div>
              <div class="col-md-6 p-1 text-center">
                Culmina {{ activeUser()?.datee | timeAgo }}<br />
                <input
                  type="datetime-local"
                  class="btn btn-info w-100"
                  [ngModel]="formatDateForInput(activeUser()?.datee)"
                  (ngModelChange)="updateLimitGetAverage($event, 'datee')"
                />
              </div>
            </div>

            <!-- Filtros Avanzados -->
            <div class="d-flex justify-content-center align-items-center gap-2 mt-2 flex-wrap">
              <select class="form-select w-auto" [(ngModel)]="year">
                @for (opt of yearOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>

              <select class="form-select w-auto" [(ngModel)]="mencion">
                @for (opt of mencionOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>

              <select class="form-select w-auto" [(ngModel)]="ciclo">
                @for (opt of cicloOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

          <app-export-to-excel [year]="year()" [ciclo]="ciclo()" [mencion]="mencion()" />
          <app-excel [year]="year()" [ciclo]="ciclo()" [mencion]="mencion()" />
          <app-admin-student-manager />  
      
          <!-- Módulo de Administración de Estudiantes -->
          @if (hasStudentsActive()) {
            <div class="mt-3 p-3 border rounded bg-white">
              <h4>Administrador de Estudiantes</h4>
              <div class="list-group">
                @for (std of stds(); track std._id) {
                  <div class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span>{{ std.mencion }} ({{ std.notas }}) {{ std.records?.length || 0 }}</span>

                    @if ((std.records?.length || 0) > 0) {
                      <div class="d-flex flex-wrap gap-1">
                        @for (sttd of std.records; track sttd._id) {
                          <span class="badge bg-secondary">{{ sttd.email }}</span>
                        }
                      </div>
                    }

                    <button class="btn btn-sm btn-outline-primary" (click)="onConvalidateClick(std, 'Arte', 'Arte')">
                      Convalidar Curso
                    </button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Módulo del Profesor (Rol == '2') -->
      @if (activeUser()?.rol === '2') {
        <div class="container p-0 text-center my-3">
          <div class="d-flex justify-content-center align-items-center gap-2">
            <select class="form-select w-auto" [(ngModel)]="mencion">
              @for (opt of mencionOptions; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>

            <select class="form-select w-auto" [(ngModel)]="semestre">
              @for (opt of semestreOptions; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </div>

          <div class="mt-2">
            <button type="button" class="btn btn-primary text-uppercase" (click)="openAddTeacherCoursesModal()">
              Agregar cursos ESFA FGPA
            </button>
          </div>

          <div class="row justify-content-center align-items-center mt-3">
            @for (message of cursesTeacher(); track message._id) {
              <div class="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                <div class="p-1 rounded contenedor border">
                  <img
                    class="image img-fluid"
                    [src]="apiUrl + '/collections/' + message.img"
                    alt="Curso"
                    (error)="handleImageError($event)"
                  />
                  <div class="overlay-text p-2">
                    <div class="mb-3 h5 border rounded ffont">
                      {{ message.title }} [{{ message.mencion }}] [{{ message.ciclo }}]
                    </div>
                    <div>
                      <button
                        class="btn btn-info text-light w-100 mt-2"
                        (click)="navigateToCourse(message)"
                      >
                        Ir al curso
                      </button>
                      <button type="button" class="btn btn-danger mt-2 w-100" (click)="deleteCurse(message._id)">
                        Eliminar Curso
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Módulo del Estudiante (Rol == '3') -->
      @if (activeUser()?.rol === '3') {
        <div class="my-3 p-3 border rounded bg-light">
          <h3>Panel de Notas del Estudiante</h3>
          <div class="table-responsive">
            <table class="table table-striped table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>Curso / Total</th>
                  <th>Menciones y Ciclos</th>
                </tr>
              </thead>
              <tbody>
                @for (item of stdCalification(); track item._id || $index) {
                  <tr>
                    <td class="fw-bold">
                      {{ item._id }}
                      <span class="badge bg-secondary ms-2">Total: {{ item.total }} Ciclo: {{ item._id }}</span>
                    </td>
                    <td>
                      @for (itemm of item.mencions; track itemm._id || $index) {
                        <div class="mb-3 p-2 bg-light rounded border">
                          <div class="fw-semibold text-primary mb-1">
                            <i class="bi bi-bookmark me-1"></i>Mención: {{ itemm._id }}
                          </div>
                          <app-export-to-pdf [data]="stdCalification()" [cicle]="item._id" [yyear]="itemm._id" />
                         
                          <table class="table table-sm table-hover bg-white mb-0 mt-2">
                            <thead>
                              <tr>
                                <th>Título / Ciclo</th>
                                <th class="text-end">Nota</th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (itemmm of itemm.cycles; track $index) {
                                <tr>
                                  <td>{{ itemmm.title }}</td>
                                  <td class="text-end fw-bold">{{ itemmm.nota === '-0' ? 'Licencia' : itemmm.nota }}</td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      } @empty {
                        <span class="text-muted fs-7">Sin menciones registradas</span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="2" class="text-center text-muted py-3">No hay calificaciones disponibles</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

    @if (activeUser()?.rol === '4') {
        <div class="my-3 p-3 border rounded bg-light text-center">
          <h4>Panel de Control Administrativo</h4>
          <p class="text-muted">Acceda a la sección de gestión y seguimiento de trámites institucionales.</p>
          <a class="btn btn-primary text-white" routerLink="/tramite">
            <i class="bi bi-file-earmark-text"></i> Ir al Panel de Trámites
          </a>
        </div>
      }
    </div>
    <div class="py-3"></div>
  `
})
export class CreateNoteComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  router = inject(Router);
  private destroy$ = new Subject<void>();

  readonly apiUrl = `${environment.apiURL}/api`;
  readonly apiUrlfile = `${environment.apiURL}`;
  readonly defaultImg = '/logo.svg';

  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly yearOptions = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' }
  ];

  readonly mencionOptions = [
    { value: 'ED', label: 'ED' },
    { value: 'E', label: 'E' },
    { value: 'G', label: 'G' },
    { value: 'P', label: 'P' }
  ];

  readonly cicloOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1)
  }));

  readonly semestreOptions = [
    { value: 'i', label: 'IMPAR' },
    { value: 'p', label: 'PAR' }
  ];

  activeUser: WritableSignal<User | null> = signal(null);
  cursesTeacher: WritableSignal<Curse[]> = signal([]);
  report: WritableSignal<any[]> = signal([]);
  cursesSource: WritableSignal<CurseGroup[]> = signal([]);
  stdCalification: WritableSignal<any[]> = signal([]);
  stds: WritableSignal<any[]> = signal([]);
  stdsConvalidate: WritableSignal<ConvalidateRecord[]> = signal([]);
  student: WritableSignal<User | null> = signal(null);
  generatedCurses: WritableSignal<GeneratedCurse[]> = signal([]);

  files: WritableSignal<File | null> = signal(null);
  photoSelected: WritableSignal<string> = signal('');
  namefile: WritableSignal<string> = signal('');

  title: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');
  nota: WritableSignal<string> = signal('');
  mencion: WritableSignal<string> = signal('ED');
  ciclo: WritableSignal<string> = signal('1');
  year: WritableSignal<string> = signal('2025');
  semestre: WritableSignal<string> = signal(new Date().getMonth() + 1 < 8 ? 'i' : 'p');

  curseid: WritableSignal<string> = signal('');
  idcurse: WritableSignal<string> = signal('');
  foto: WritableSignal<string> = signal('');
  codigo: WritableSignal<string> = signal('');
  credito: WritableSignal<string> = signal('');

  showModal: WritableSignal<boolean> = signal(false);
  convalidate: WritableSignal<boolean> = signal(false);
  submit: WritableSignal<string> = signal('');
  option: WritableSignal<string> = signal('2');

  toasts: WritableSignal<{ message: string; bgClass: string }[]> = signal([]);

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.activeUser.set(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parseando usuario de localStorage', e);
      }
    }

    const currentAuth = this.activeUser();
    if (currentAuth) {
      this.getGenerateCurses();
      this.getNotes();
      if (currentAuth.rol === '3') {
        this.getStdCalifications();
      }
    }

    ['idc', 'idcat', 'curse'].forEach(field => localStorage.removeItem(field));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleUserUpdated(updatedUser: any): void {
    this.activeUser.set(updatedUser);
  }

  public handleError(error: any): void {
    if (error.status === 401) {
      console.log('Sesión expirada o no autorizada.');
    }
  }

  showToast(message: string, type: 'info' | 'error' | 'warning' | 'dark' = 'info') {
    const bgClasses = {
      info: 'bg-info',
      error: 'bg-danger',
      warning: 'bg-warning text-dark',
      dark: 'bg-dark'
    };
    const newToast = { message, bgClass: bgClasses[type] || 'bg-info' };
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.toasts.update(current => current.filter(t => t !== newToast));
    }, 3000);
  }

  removeToast(index: number) {
    this.toasts.update(current => current.filter((_, i) => i !== index));
  }

  getNotes() {
    const user = this.activeUser();
    if (!user?._id) return;

    this.http.get<any[]>(`${this.apiUrl}/curses/cursosespecificos/${user._id}/true/source`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data?.[0]) {
            this.cursesTeacher.set(data[0].curses || []);
            this.report.set(data[0].cursesstd || []);
          }
        },
        error: () => this.showToast('Error cargando notas.', 'error')
      });
  }

  getGenerateCurses() {
    const user = this.activeUser();
    if (!user?._id) return;

    this.http.get<GeneratedCurse[]>(`${this.apiUrl}/curses/Getgeneratecursosculqui/${user._id}/true`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.generatedCurses.set(Array.isArray(res) ? res : []),
        error: (err: HttpErrorResponse) => this.showToast(`Error al generar cursos: ${err.message}`, 'error')
      });
  }

  getStdCalifications() {
    const user = this.activeUser();
    if (!user?._id) return;

    this.http.get<any[]>(`${this.apiUrl}/users/stdnotes/${user._id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.stdCalification.set(Array.isArray(data) ? data : []),
        error: () => this.showToast('Error al cargar calificaciones del estudiante.', 'error')
      });
  }

  getSourcesCurses(targetMencion: string, targetCiclo: string) {
    this.http.get<CurseGroup[]>(`${this.apiUrl}/curses/cursossources/${targetMencion}/${targetCiclo}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cursesSource.set(data || []);
          this.openModal();
        },
        error: (err: HttpErrorResponse) => this.showToast(`Error al obtener información: ${err.message}`, 'error')
      });
  }

  updateLimitGetAverage(dateValue: string, name: string) {
    this.http.post(`${this.apiUrl}/users/UpdateLimitGetAverage`, { date: dateValue, name }, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.showToast(res, 'info'),
        error: () => this.showToast('Error al guardar la fecha', 'error')
      });
  }

  curseUpdate() {
    const formData = new FormData();
    const currentFile = this.files();
    if (currentFile) formData.append('img', currentFile);
    formData.append('description', this.description());
    formData.append('title', this.title());

    this.http.put(`${this.apiUrl}/curses/${this.idcurse()}`, formData, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.showToast(res, 'dark');
          this.closeModal();
          this.getNotes();
        },
        error: (err: HttpErrorResponse) => this.showToast(`Error de actualización: ${err.message}`, 'error')
      });
  }

  curseCreate(cTitle: string, cDesc: string, cMencion: string, cCredito: string, cCiclo: string, cCodigo: string) {
    const user = this.activeUser();
    if (!user?._id) return;

    const payload = {
      user: user._id,
      show: 'true',
      mencion: cMencion,
      credito: cCredito,
      ciclo: cCiclo,
      codigo: cCodigo,
      title: cTitle,
      type: 'source',
      year: String(new Date().getFullYear()),
      description: cDesc
    };

    this.http.post(`${this.apiUrl}/curses/`, payload, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res === 'Ya agregó el curso') {
            this.showToast(res, 'error');
          } else {
            this.showToast(res, 'dark');
            this.closeModal();
            this.getNotes();
          }
        },
        error: (err: HttpErrorResponse) => this.showToast(`Error al crear curso: ${err.message}`, 'error')
      });
  }

  deleteCurse(noteId: string) {
    if (confirm('¿Deseas eliminar este curso?')) {
      this.http.delete(`${this.apiUrl}/curses/${noteId}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getNotes();
            this.showToast('Removido correctamente', 'dark');
          },
          error: () => this.showToast('Error al eliminar el curso.', 'error')
        });
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.[0]) {
      const selectedFile = target.files[0];
      this.files.set(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        this.photoSelected.set(reader.result as string);
        this.namefile.set(selectedFile.type);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  triggerFileInput() {
    this.fileInputRef?.nativeElement?.click();
  }

  handleSelectSourceCurse(message: Curse) {
    if (this.option() === '3') {
      this.convalidate.set(true);
      this.curseid.set(message._id);
      this.title.set(message.title);
      this.mencion.set(message.mencion || 'ED');
      this.credito.set(message.credito || '');
      this.ciclo.set(message.ciclo || '1');
      this.codigo.set(message.codigo || '');
      this.submit.set('Calificar curso a convalidar');
    } else {
      this.curseCreate(message.title, message.description || '', message.mencion || '', message.credito || '', message.ciclo || '', message.codigo || '');
    }
  }

  openAddTeacherCoursesModal() {
    const mentionNames: Record<string, string> = { P: 'Pintura', G: 'Grabado', ED: 'Educación artística', E: 'Escultura' };
    this.submit.set(`Agregar cursos [Mención: ${mentionNames[this.mencion()] || this.mencion()}. Semestre: ${this.semestre() === 'i' ? 'Impar' : 'Par'}]`);
    this.option.set('1');
    this.getSourcesCurses(this.mencion(), this.semestre());
  }

  onConvalidateClick(std: User, messageId: string, label: string) {
    this.submit.set(`Selecionar curso a convalidar, de los cursos de ${label || 'Arte'} [Impar]`);
    this.option.set('3');
    this.student.set(std);
    this.getSourcesCurses(messageId, this.semestre());
  }

  navigateToCourse(curseItem: Curse) {
    localStorage.setItem('curse', JSON.stringify(curseItem));
    this.router.navigate(['/actualizacion', curseItem._id]);
  }

  openModal() { this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  hasStudentsActive(): boolean {
    return this.stds().length > 0;
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.defaultImg;
  }

  formatDateForInput(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 16);
  }
}