import {
  Component,
  OnInit,
  computed,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { parseISO } from 'date-fns';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { ExportToExcelComponent } from './actualizacionprinttest';
import { UserLoaderComponent } from './userget';
import { ExportToExcelComponentNotas } from './actializaiconexcelteacher';
import { ExportToPdfComponent } from './actualizaciondiploma';
import { Navbar } from './navbar';
import { environment } from '../../environments/environment';

// --- INTERFACES DE DATOS ---
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  rol: string;
  dateb?: string;
  datee?: string;
}

export interface Calificacion {
  _id: string;
  nota: string;
  teacheremail: string;
}

export interface StudentAverage {
  _id: string;
  dni: string;
  name: string;
  email: string;
  tipostd?: string;
  notta: Calificacion[];
}

export interface NativeStudent {
  _id: string;
  usser: { email: string }[];
}

export interface Subtheme {
  title: string;
  detail: string;
  idtheme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  _id?: string;
  title: string;
  detail: string;
  idtheme: string;
  subthemes: Subtheme[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  title: string;
  detail: string;
  themes: Theme[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  _id: string;
  user: string;
  title: string;
  mencion: string;
  ciclo: string;
  year: string;
  codigo: string;
  credito: number;
  units: Unit[];
}

export interface ChartStats {
  total: number;
  aprobados: number;
  desaprobados: number;
  retirados: number;
  licencia: number;
  sinNota: number;
  pctAprobados: string;
  pctDesaprobados: string;
  pctRetirados: string;
  pctLicencia: string;
  pctSinNota: string;
}

@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ExportToExcelComponent, 
    RouterLink, 
    CKEditorModule, 
    Navbar, 
    ExportToPdfComponent, 
    UserLoaderComponent, 
    ExportToExcelComponentNotas
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="py-5"></div>
    <app-user-loader 
      (userUpdated)="handleUserUpdated($event)" 
      (onError)="handleError($event)">
    </app-user-loader>

    <!-- Modal CKEditor -->
    <div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header h1 ffont">{{ title() }}</div>
          <div class="modal-body">
            <ckeditor [editor]="Editor" [data]="task()"></ckeditor>
          </div>
          <div class="modal-footer p-3">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container text-center">
      @if (activeUser()?.rol === '2') {
        <a
          class="btn btn-info h2 w-100 mb-2 text-uppercase text-light ffont"
          [class.d-none]="!isDateWithinRange()"
          [class.disabled]="isDisabled() || !course()"
          (click)="getStdscalification()"
        >
          <span class="ffont h5">
            Calificar estudiantes ESFA [
            @if (course()?.ciclo) { Ciclo: {{ course()?.ciclo }}. }
            Crédito: {{ course()?.credito }}. Código: {{ course()?.codigo }}. Año: {{ course()?.year }}.
            ]
          </span>
        </a>

        @if (stdaverages().length > 0 && isDateWithinRange() && course()) {
          <export-to-excel
            [data]="stdaverages()"
            [year]="course()?.year"
            [ciclo]="course()?.ciclo"
            [mencion]="course()?.mencion"
            [curse]="course()?.title"
            [credito]="course()?.credito">
          </export-to-excel>

          <div class="btn-group my-2">
            <button type="button" class="btn btn-info" (click)="handlePrint()">
              Imprimir reporte en PDF
            </button>
          </div>
        }
      }
    </div>

    <div class="container text-center" #printArea>
      @if (course(); as zz) {
        <div class="bg-light p-3 rounded mt-1 shadow-sm">
          <h2 class="ffont text-primary font-weight-bold">{{ zz.title }}</h2>
          <p class="ffont text-muted mb-1">{{ activeUser()?.name }} — ID: {{ activeUser()?._id }}</p>
          <h5 class="ffont text-secondary">
            @if (zz.ciclo) { Ciclo: {{ zz.ciclo }}. }
            Crédito: {{ zz.credito }}.
            @if (zz.mencion) { Carrera: {{ zz.mencion }}. }
            Año: {{ zz.year }}.
          </h5>
        </div>

        <div class="text-center my-2" [class.d-none]="isDateWithinRange()">
          <a class="btn btn-outline-primary m-1" [href]="'/video/' + id()"><i class="bi bi-camera"></i> CONFERENCIA DEL CURSO</a>
          <a class="btn btn-outline-info m-1" [routerLink]="'/forum/' + id()"><i class="bi bi-chat-dots"></i> FORO DEL CURSO</a>
          <app-export-to-pdf [datacurse]="course()" [user]="activeUser()" [nota]="notaTotaldelCurso()"></app-export-to-pdf>
        </div>

        <div class="text-center mb-2">
          @if (activeUser()?.rol === '1') {
            <button class="btn btn-primary w-100" [disabled]="isDisabled()" (click)="getStdNativescalification(zz._id)">
              Calificar Native
            </button>
          }
        </div>
      } @else {
        <div class="p-5 text-muted">Cargando información del curso...</div>
      }

      <div>
        <!-- GRÁFICO ESTADÍSTICO DE RENDIMIENTO -->
        @if (stdaverages().length > 0) {
          <div class="card shadow-sm border-0 bg-white p-4 text-left my-3">
            <h4 class="ffont mb-3 text-dark font-weight-bold">Distribución de Rendimiento Académico</h4>
            <div class="row align-items-center">
              <div class="col-md-7 mb-3">
                <div class="d-flex flex-column" style="gap: 15px;">
                  <!-- Aprobados -->
                  <div>
                    <div class="d-flex justify-content-between small text-muted font-weight-bold mb-1">
                      <span>Aprobados (Nota ≥ 11)</span>
                      <span>{{ chartStats().aprobados }} ({{ chartStats().pctAprobados }}%)</span>
                    </div>
                    <div class="progress" style="height: 22px;">
                      <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" [style.width.%]="chartStats().pctAprobados"></div>
                    </div>
                  </div>
                  <!-- Desaprobados -->
                  <div>
                    <div class="d-flex justify-content-between small text-muted font-weight-bold mb-1">
                      <span>Desaprobados (Nota &lt; 11)</span>
                      <span>{{ chartStats().desaprobados }} ({{ chartStats().pctDesaprobados }}%)</span>
                    </div>
                    <div class="progress" style="height: 22px;">
                      <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" [style.width.%]="chartStats().pctDesaprobados"></div>
                    </div>
                  </div>
                  <!-- Retirados -->
                  <div>
                    <div class="d-flex justify-content-between small text-muted font-weight-bold mb-1">
                      <span>Retirados (R)</span>
                      <span>{{ chartStats().retirados }} ({{ chartStats().pctRetirados }}%)</span>
                    </div>
                    <div class="progress" style="height: 22px;">
                      <div class="progress-bar bg-warning progress-bar-striped" role="progressbar" [style.width.%]="chartStats().pctRetirados"></div>
                    </div>
                  </div>
                  <!-- Licencias -->
                  <div>
                    <div class="d-flex justify-content-between small text-muted font-weight-bold mb-1">
                      <span>Licencias (L)</span>
                      <span>{{ chartStats().licencia }} ({{ chartStats().pctLicencia }}%)</span>
                    </div>
                    <div class="progress" style="height: 22px;">
                      <div class="progress-bar bg-success progress-bar-striped" role="progressbar" [style.width.%]="chartStats().pctLicencia"></div>
                    </div>
                  </div>
                  <!-- Sin Calificar -->
                  <div>
                    <div class="d-flex justify-content-between small text-muted font-weight-bold mb-1">
                      <span>Sin Calificar</span>
                      <span>{{ chartStats().sinNota }} ({{ chartStats().pctSinNota }}%)</span>
                    </div>
                    <div class="progress" style="height: 22px;">
                      <div class="progress-bar bg-secondary" role="progressbar" [style.width.%]="chartStats().pctSinNota"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Panel Resumen Lateral -->
              <div class="col-md-5">
                <div class="p-3 bg-light rounded border text-center">
                  <span class="text-muted uppercase small font-weight-bold d-block mb-1">Matrícula Evaluada</span>
                  <h2 class="display-4 font-weight-bold text-dark mb-0">{{ chartStats().total }}</h2>
                  <p class="text-muted small mt-1 mb-0">Estudiantes sincronizados en la sección</p>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- TABLA DE CALIFICACIONES SEMESTRE ESFA -->
        @if (stdaverages().length > 0) {
          <div class="my-4 table-responsive" id="notas" style="min-height: 50vh;">
            <h4 class="text-left ffont mb-3 text-dark font-weight-bold">Registro de Notas Semestrales</h4>
            <table class="table table-hover table-bordered bg-white shadow-sm">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">N°</th>
                  <th scope="col">DNI</th>
                  <th scope="col">Estudiante / Email</th>
                  <th scope="col">Docente</th>
                  <th scope="col">Nota Actual</th>
                  <th scope="col">Acciones / Ingreso</th>
                </tr>
              </thead>
              <tbody>
                @for (note of stdaverages(); track note._id; let index = $index) {
                  <tr class="align-middle">
                    <td>{{ index + 1 }}</td>
                    <td class="font-weight-bold">{{ note.dni }}</td>
                    <td class="text-left font-weight-bold p-2">
                      {{ note.name }}
                      <span class="text-muted d-block small">{{ note.email }} {{ note.tipostd }}</span>
                    </td>
                    <td>
                      @if (note.notta.length > 0) {
                        <span class="text-muted d-block small">{{ note.notta[0].teacheremail }}</span>
                      } @else {
                        <span class="text-danger small font-italic">Sin calificar</span>
                      }
                    </td>
                    <td>
                      @if (note.notta.length > 0) {
                        <span
                          class="font-weight-bold"
                          [ngClass]="{
                            'text-warning': note.notta[0].nota === '0',
                            'text-success': note.notta[0].nota === '-0',
                            'text-danger': note.notta[0].nota !== '0' && note.notta[0].nota !== '-0' && +note.notta[0].nota < 11,
                            'text-info': note.notta[0].nota !== '0' && note.notta[0].nota !== '-0' && +note.notta[0].nota >= 11
                          }"
                        >
                          {{ note.notta[0].nota === '0' ? 'RETIRADO' : note.notta[0].nota === '-0' ? 'LICENCIA' : note.notta[0].nota }}
                        </span>
                      } @else {
                        <span class="text-danger small font-italic">Sin calificar</span>
                      }
                    </td>
                    <td class="text-center">
                      @if (note.notta.length > 0) {
                        <button
                          class="btn btn-danger btn-sm"
                          [disabled]="isDisabled() || note.notta[0].teacheremail !== activeUser()?.email"
                          (click)="removeCalification(note.notta[0]._id)"
                        >
                          Remover Nota
                        </button>
                      } @else {
                        <input
                          #notaInput
                          type="text"
                          class="form-control form-control-sm text-center mx-auto"
                          style="max-width: 120px;"
                          placeholder="Nota (0-20 o R)"
                          [disabled]="isDisabled()"
                          (blur)="onInputChange(notaInput.value, note.email, note.name, note._id)"
                          required
                        />
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- TABLA DE ESTUDIANTES NATIVE -->
      @if (stdaveragesNative().length > 0) {
        <div class="my-4 table-responsive">
          <h4 class="text-left ffont mb-3 text-primary">Estudiantes Native Registrados</h4>
          <table class="table table-hover table-bordered bg-white shadow-sm">
            <thead class="bg-primary text-white">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Correo Institucional</th>
              </tr>
            </thead>
            <tbody>
              @for (note of stdaveragesNative(); track $index) {
                <tr>
                  <th scope="row">{{ $index + 1 }}</th>
                  <td class="text-left font-weight-bold">
                    {{ note.usser[0]?.email || 'Sin correo asociado' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (activeUser()?.rol === '1') {
        <button class="form-control btn btn-warning mb-3 font-weight-bold" [disabled]="isDisabled()" (click)="createUnit()">
          + Agregar unidad
        </button>
      }

      <!-- UNIDADES Y TEMAS -->
      <div class="row d-flex justify-content-center">
        @for (unit of units(); track $index; let i = $index) {
          <div class="col-md-6 col-lg-6 p-1">
            <div class="border rounded bg-white shadow-sm p-3 m-1">
              <div
                #unitTitleInput
                class="ffont h5 font-weight-bold text-dark p-1 border-bottom"
                [attr.contenteditable]="activeUser()?.rol === '1'"
                (blur)="updateUnit(unitTitleInput.innerText, i)"
              >
                {{ unit.title }}
              </div>

              @if (activeUser() && course() && activeUser()?._id === course()?.user) {
                <div class="my-2 d-flex justify-content-end gap-1">
                  <button class="btn btn-sm btn-outline-success me-1" (click)="createTheme(i)">+ Tema</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="removeUnit(i)">Eliminar Unidad</button>
                </div>
              }

              <div class="row d-flex justify-content-center p-1">
                @for (theme of unit.themes; track $index; let j = $index) {
                  <div class="col-md-6 col-lg-6 mb-2 p-1">
                    <div class="rounded border shadow-sm p-2" style="background-color: #f4f8f9;">
                      <div
                        #themeTitleInput
                        class="font-weight-bold text-secondary mb-2"
                        [attr.contenteditable]="activeUser()?.rol === '1'"
                        (blur)="updateTheme(themeTitleInput.innerText, i, j)"
                      >
                        {{ theme.title }}
                      </div>

                      <app-export-to-excel
                        [idtheme]="course()?._id || ''"
                        [codetheme]="theme.idtheme"
                        [i]="i"
                        [j]="j"
                        [usser]="activeUser()?._id || ''"
                      />
                    
                      <button
                        class="btn btn-info btn-sm w-100 mt-2 text-white font-weight-bold"
                        [disabled]="isDisabled()"
                        (click)="createatachTheme(theme.idtheme, unit.title, theme.title)"
                      >
                        Ir al tema
                      </button>

                      @if (activeUser() && course() && activeUser()?._id === course()?.user) {
                        <div class="mt-2 d-flex justify-content-center gap-1">
                          <button class="btn btn-sm btn-outline-secondary me-1" (click)="createSubTheme(i, j)">+ Subtema</button>
                          <button class="btn btn-sm btn-outline-danger" (click)="removeTheme(i, j)">Eliminar Tema</button>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ffont {
      font-family: inherit;
    }
  `]
})
export class CreateNoteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastrService);

  readonly Editor = ClassicEditor;

  readonly activeUser = signal<AuthUser | null>(this.getAuthUser());
  readonly id = signal<string>('');
  readonly course = signal<Course | null>(null);
  readonly units = signal<Unit[]>([]);
  readonly stdaverages = signal<StudentAverage[]>([]);
  readonly stdaveragesNative = signal<NativeStudent[]>([]);
  readonly notaTotaldelCurso = signal<number>(0);
  readonly isDisabled = signal<boolean>(false);
  readonly task = signal<string>('');
  readonly title = signal<string>('');

  readonly isDateWithinRange = computed(() => {
    const user = this.activeUser();
    if (!user?.dateb || !user?.datee) return false;
    const now = new Date();
    return parseISO(user.dateb) < now && now < parseISO(user.datee);
  });

  readonly chartStats = computed<ChartStats>(() => {
    let aprobados = 0, desaprobados = 0, retirados = 0, licencia = 0, sinNota = 0;
    const students = this.stdaverages();

    students.forEach((student) => {
      if (student.notta && student.notta.length > 0) {
        const notaStr = student.notta[0].nota;
        if (notaStr === '0') retirados++;
        else if (notaStr === '-0') licencia++;
        else {
          const notaNum = Number(notaStr);
          if (!isNaN(notaNum)) {
            if (notaNum >= 11) aprobados++;
            else desaprobados++;
          } else {
            sinNota++;
          }
        }
      } else {
        sinNota++;
      }
    });

    const total = students.length || 1;

    return {
      total: students.length,
      aprobados,
      desaprobados,
      retirados,
      licencia,
      sinNota,
      pctAprobados: ((aprobados / total) * 100).toFixed(1),
      pctDesaprobados: ((desaprobados / total) * 100).toFixed(1),
      pctRetirados: ((retirados / total) * 100).toFixed(1),
      pctLicencia: ((licencia / total) * 100).toFixed(1),
      pctSinNota: ((sinNota / total) * 100).toFixed(1)
    };
  });

  private readonly API_URL = `${environment.apiURL}/api`;

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id') || '';
    this.id.set(paramId);
    this.initData();
  }

  private getAuthUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  public handleUserUpdated(updatedUser: AuthUser): void {
    this.activeUser.set(updatedUser);
  }

  public handleError(error: any): void {
    if (error?.status === 401) {
      console.warn('Sesión expirada o no autorizada.');
    }
  }

  async initData(): Promise<void> {
    try {
      const user = this.activeUser();
      if (!user?._id) return;

      const urlParams = `${this.id()}/${user._id}`;
      const [notesData, testData] = await Promise.all([
        firstValueFrom(this.http.get<Course[]>(`${this.API_URL}/curses/ControllerAll/${urlParams}`)),
        firstValueFrom(this.http.get<any[]>(`${this.API_URL}/tasks/tests/new/${urlParams}`))
      ]);

      const courseObj = notesData[0] || null;
      const totalNotes = testData.reduce((acc, curr) => acc + Number(curr.note || 0), 0);

      this.course.set(courseObj);
      this.units.set(courseObj?.units || []);
      this.notaTotaldelCurso.set(totalNotes);
    } catch (error) {
      console.error('Error inicializando datos:', error);
      this.toast.error('Error al cargar la información del curso');
    }
  }

  async getStdscalification(mencion?: string, ciclo?: string, year?: string, codigo?: string): Promise<void> {
    const c = this.course();
    const m = mencion || c?.mencion;
    const ci = ciclo || c?.ciclo;
    const y = year || c?.year;
    const cod = codigo || c?.codigo;

    try {
      const data = await firstValueFrom(
        this.http.get<StudentAverage[]>(`${this.API_URL}/users/stdaverages/${m}/${ci}/${y}/${cod}`)
      );

      data.forEach((student) => {
        if (student.tipostd === 'L' && student.notta.length === 0) {
          this.onInputChange('-0', student.email, student.name, student._id);
        }
      });

      this.stdaverages.set(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      this.isDisabled.set(false);
    }
  }

  async getStdNativescalification(nativeId: string): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<NativeStudent[]>(`${this.API_URL}/users/stdaveragesnative/${nativeId}`)
      );
      this.stdaveragesNative.set(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      this.isDisabled.set(false);
    }
  }

  async onInputChange(nota: string, email: string, name: string, userid: string): Promise<void> {
    const zz = this.course();
    if (!nota || !zz) return;

    const { mencion, ciclo, year, codigo, title: courseTitle, credito } = zz;

    if (/\s/.test(nota)) {
      this.getStdscalification(mencion, ciclo, year, codigo);
      this.toast.warning('Introduzca calificación sin espacios');
      return;
    }

    const numericNote = Number(nota);
    const isValidNote = nota === 'R' || (!isNaN(numericNote) && numericNote >= 0 && numericNote <= 20);

    if (!isValidNote) {
      this.getStdscalification(mencion, ciclo, year, codigo);
      this.toast.info('La calificación es vigesimal o R : Retirado');
      return;
    }

    try {
      this.isDisabled.set(true);
      const user = this.activeUser();
      if (!user) return;

      await firstValueFrom(
        this.http.post(`${this.API_URL}/curses/average`, {
          nota: nota === 'R' ? '0' : nota,
          codigo,
          user: userid,
          useremail: email,
          username: name,
          teacheremail: user.email,
          teacherrol: user.rol,
          teacherid: user._id,
          teacher: user._id,
          curso: this.id(),
          title: courseTitle,
          ciclo,
          credito,
          mencion,
          year
        })
      );
      this.toast.info("Nota guardada");
      await this.getStdscalification(mencion, ciclo, year, codigo);
    } catch (error) {
      console.error(error);
    } finally {
      this.isDisabled.set(false);
    }
  }

  async syncCourseToBackend(updatedUnits: Unit[]): Promise<void> {
    try {
      const zz = this.course();
      if (!zz) return;
      const updatedCourse = { ...zz, units: updatedUnits };

      this.units.set(updatedUnits);
      this.course.set(updatedCourse);

      await firstValueFrom(
        this.http.put(`${this.API_URL}/curses/curse/${this.id()}`, updatedCourse)
      );
    } catch (error) {
      console.error('Error sincronizando curso:', error);
      this.toast.error('No se pudieron guardar los cambios');
    }
  }

  createUnit(): void {
    const updatedUnits: Unit[] = [
      ...this.units(),
      {
        title: 'Nueva Unidad',
        detail: '',
        themes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.syncCourseToBackend(updatedUnits);
  }

  updateUnit(text: string, i: number): void {
    const currentUnits = [...this.units()];
    if (!currentUnits[i]) return;

    currentUnits[i] = {
      ...currentUnits[i],
      title: text.trim(),
      updatedAt: new Date()
    };
    this.syncCourseToBackend(currentUnits);
  }

  createTheme(i: number): void {
    const currentUnits = [...this.units()];
    if (!currentUnits[i]) return;

    const newTheme: Theme = {
      title: 'Nuevo Tema',
      detail: '',
      subthemes: [],
      idtheme: Math.random().toString(36).substring(2, 11).toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    currentUnits[i] = {
      ...currentUnits[i],
      themes: [...currentUnits[i].themes, newTheme]
    };

    this.syncCourseToBackend(currentUnits);
  }

  updateTheme(text: string, i: number, j: number): void {
    const currentUnits = [...this.units()];
    if (!currentUnits[i]?.themes[j]) return;

    const updatedThemes = [...currentUnits[i].themes];
    updatedThemes[j] = {
      ...updatedThemes[j],
      title: text.trim(),
      updatedAt: new Date()
    };

    currentUnits[i] = {
      ...currentUnits[i],
      themes: updatedThemes
    };

    this.syncCourseToBackend(currentUnits);
  }

  createSubTheme(i: number, j: number): void {
    const currentUnits = [...this.units()];
    if (!currentUnits[i]?.themes[j]) return;

    const newSubtheme: Subtheme = {
      title: 'Nuevo Subtema',
      detail: '',
      idtheme: Math.random().toString(36).substring(2, 11).toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedThemes = [...currentUnits[i].themes];
    updatedThemes[j] = {
      ...updatedThemes[j],
      subthemes: [...updatedThemes[j].subthemes, newSubtheme]
    };

    currentUnits[i] = {
      ...currentUnits[i],
      themes: updatedThemes
    };

    this.syncCourseToBackend(currentUnits);
  }

  removeUnit(i: number): void {
    if (window.confirm('¿Deseas eliminar esta unidad?')) {
      const updatedUnits = this.units().filter((_, index) => index !== i);
      this.syncCourseToBackend(updatedUnits);
    }
  }

  removeTheme(i: number, j: number): void {
    if (window.confirm('¿Deseas eliminar este tema?')) {
      const currentUnits = [...this.units()];
      if (!currentUnits[i]) return;

      currentUnits[i] = {
        ...currentUnits[i],
        themes: currentUnits[i].themes.filter((_, index) => index !== j)
      };

      this.syncCourseToBackend(currentUnits);
    }
  }

  async removeCalification(califId: string): Promise<void> {
    if (!window.confirm('¿Deseas eliminar esta calificación?')) return;
    try {
      this.isDisabled.set(true);
      await firstValueFrom(this.http.delete(`${this.API_URL}/curses/average/${califId}`));
      const zz = this.course();
      if (zz) {
        await this.getStdscalification(zz.mencion, zz.ciclo, zz.year, zz.codigo);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isDisabled.set(false);
    }
  }

  async createatachTheme(idtheme: string, titleunit: string, titletheme: string): Promise<void> {
    if (this.isDisabled()) return;

    const user = this.activeUser();
    const courseId = this.course()?._id || this.id();

    this.isDisabled.set(true);

    try {
      if (user?.rol === '1') {
        const timestop = new Date();
        timestop.setHours(timestop.getHours() + 1);

        await firstValueFrom(
          this.http.post(`${this.API_URL}/seccions`, {
            user: user._id,
            curse: this.id(),
            idtheme,
            title: titletheme,
            timetest: 1,
            description: '...contenido markdown...',
            dateb: new Date(),
            datee: timestop.toISOString()
          })
        );
      }

      await this.router.navigate([`/tema/${courseId}/${idtheme}`], {
        state: { unittitle: titleunit, title: titletheme }
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.isDisabled.set(false);
    }
  }

  handlePrint(): void {
    window.print();
  }
}