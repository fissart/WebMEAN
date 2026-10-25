import { Component, OnInit, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isAuth } from './auth';

import { ToastrService } from 'ngx-toastr';
import { Navbar } from './navbar';

interface TextItem {
  contenido?: string;
  files?: any;
  title?: any;
  atachtitle?: any;
  [key: string]: any;
}

interface NoteFile {
  title?: string;
  contenido?: string;
  user?: any;
  email?: any;
  [key: string]: any;
}

@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Navbar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar></app-navbar>
    <div class="py-5"></div>
    <div class="container-fluid px-4" style="max-width: 1400px;">
        <!-- Cabecera Superior -->
        <div class="d-flex justify-content-between align-items-center mb-4 p-3 bg-white border rounded shadow-sm">
          <div class="d-flex align-items-center gap-3">
            <!-- Botón para esconder / mostrar la barra lateral de archivos -->
            <button
              type="button"
              (click)="toggleSidebar()"
              class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 shadow-sm px-2 py-1"
              [title]="isSidebarVisible() ? 'Esconder Archivos Asociados' : 'Mostrar Archivos Asociados'"
            >
              <i class="bi" [class.bi-layout-sidebar-inset]="isSidebarVisible()" [class.bi-layout-sidebar]="!isSidebarVisible()"></i>
              <span class="d-none d-sm-inline">{{ isSidebarVisible() ? 'Ocultar Archivos' : 'Mostrar Archivos' }}</span>
            </button>

            <div>
              <h5 class="fw-bold text-dark m-0">
                <i class="bi bi-file-earmark-code text-primary me-2"></i> Gestor de Documentos LaTeX / Asymptote
              </h5>
              <!-- Información de Usuario -->
              <small class="text-muted font-monospace">
                <span>Rol: {{ auth?.rol }}</span> | <span>Email: {{ auth?.email }}</span>
              </small>
            </div>
          </div>
          
          <!-- Controles de la cabecera: Botón de Visualización condicional -->
          <div class="d-flex align-items-center gap-2">
            @if (lastPdfBlob()) {
              <button
                type="button"
                (click)="viewPdf()"
                class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 shadow-sm px-3 py-2"
                title="Ver el último PDF compilado"
              >
                <i class="bi bi-file-earmark-pdf"></i> Ver PDF Reciente
              </button>
            }
          </div>
        </div>

        <!-- LAYOUT DINÁMICO DE DOS COLUMNAS -->
        <div class="row g-4">
          
          <!-- COLUMNA DERECHA: Editor y Acciones -->
          <div [class]="isSidebarVisible() ? 'col-lg-8 col-md-7' : 'col-12'">
            <div class="card border-0 shadow-sm p-4 bg-white">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label for="textContent" class="form-label fw-bold m-0 text-secondary">
                  <i class="bi bi-code-square"></i> Código LaTeX / Asymptote: <small class="text-muted fw-normal ms-2">(Presiona <kbd>Ctrl</kbd> + <kbd>Enter</kbd> para compilar)</small>
                </label>
                <small class="text-muted font-monospace">Activo: <strong>{{ selectedTitle() }}</strong></small>
              </div>

              <!-- EDITOR CON CAPA DE COLOREADO Y ALTURA FLUIDA -->
              <div class="editor-main-wrapper position-relative border rounded bg-light d-flex overflow-hidden shadow-sm">
                
                <!-- BOTÓN FLOTANTE EN LA ESQUINA INFERIOR DERECHA -->
                <button
                  type="button"
                  (click)="sendEditedText(selectedTitle())"
                  [disabled]="isCompiling()"
                  class="btn btn-info text-white px-3 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2 position-absolute bottom-0 end-0 m-3 floating-compile-btn"
                  style="z-index: 10;"
                >
                  @if (isCompiling()) {
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Compilando...</span>
                  } @else {
                    <i class="bi bi-play-fill"></i> <span>Guardar y Compilar PDF 3D</span>
                  }
                </button>

                <!-- Columna de Números de Línea -->
                <div #lineNumbers class="line-numbers py-2 px-1 text-end select-none font-monospace text-muted bg-light border-end">
                  @for (line of lineCountArray(); track $index) {
                    <div>{{ $index + 1 }}</div>
                  }
                </div>

                <!-- Contenedor del Editor de Código con Coloreado -->
                <div class="editor-container position-relative flex-grow-1 h-100 overflow-hidden">
                  <!-- Capa de resaltado de sintaxis subyacente -->
                  <pre #syntaxLayer class="syntax-highlight-layer m-0 p-3 pb-5 position-absolute top-0 start-0 w-100 h-100" aria-hidden="true"><code [innerHTML]="highlightedCode()"></code></pre>

                  <!-- Área de Texto Interactiva -->
                  <textarea
                    #editorTextArea
                    id="textContent"
                    [ngModel]="noteText()"
                    (ngModelChange)="onTextChange($event)"
                    (scroll)="syncScroll($event)"
                    (keydown.control.enter)="!isCompiling() && sendEditedText(selectedTitle())"
                    (keydown.meta.enter)="!isCompiling() && sendEditedText(selectedTitle())"
                    class="form-control w-100 h-100 code-editor border-0 shadow-none p-3 pb-5 position-absolute top-0 start-0"
                    placeholder="Seleccione o cree un archivo..."
                    [disabled]="isCompiling()"
                    spellcheck="false"
                  ></textarea>
                </div>
              </div>
              
              <!-- NOTIFICACIÓN INTEGRADA DE ERROR -->
              @if (compilationError()) {
                <div class="alert alert-danger shadow-sm mt-3 position-relative" role="alert">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="alert-heading fw-bold mb-1">
                        <i class="bi bi-exclamation-triangle-fill"></i> Error de compilación
                      </h6>
                      <p class="mb-1 text-break">{{ compilationError()?.message }}</p>
                    </div>
                  </div>
                  
                  @if (compilationError()?.details) {
                    <hr class="my-2">
                    <pre class="error-log-box m-0">{{ compilationError()?.details }}</pre>
                  }
                </div>
              }
            </div>
          </div>

          <!-- COLUMNA IZQUIERDA: Archivos Asociados -->
          @if (isSidebarVisible()) {
            <div class="col-lg-4 col-md-5">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                  <h6 class="fw-bold text-dark m-0">
                    <i class="bi bi-folder2-open text-primary me-1"></i> Archivos Asociados
                  </h6>
                  <div class="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      (click)="openCreateModal()"
                      [disabled]="isCompiling()"
                      class="btn btn-sm btn-primary d-flex align-items-center gap-1 shadow-sm px-2 py-1"
                    >
                      Nuevo
                    </button>
                    <button
                      type="button"
                      (click)="toggleSidebar()"
                      class="btn btn-sm btn-warning d-flex align-items-center p-1 border-0"
                      title="Cerrar panel lateral"
                    >
                      Ocultar panel
                    </button>
                  </div>
                </div>

                <div class="card-body p-3 overflow-auto" style="max-height: 70vh;">
                  @if (noteFiles()) {
                    @if (isArray(noteFiles())) {
                      <ul class="list-group list-group-flush">
                        @for (file of noteFiles(); track $index) {
                          <li 
                            class="list-group-item px-3 py-3 d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm file-item"
                            [class.border-primary]="selectedTitle() === file.atachtitle"
                            [class.bg-warning]="selectedTitle() === file.atachtitle"
                            style="cursor: pointer;"
                            (click)="selectFile(file); selectAndCompile(file._id)"
                          >
                            <div class="text-truncate me-2 w-100">
                              <span 
                                contenteditable="true" 
                                (blur)="updateNote(file._id, $event)"
                                class="fw-bold text-dark d-block text-truncate border-bottom border-transparent px-1"
                                style="outline: none;"
                                title="Haz clic para editar el título"
                                (click)="$event.stopPropagation()"
                              >{{ getDisplayName(file.title) }}</span>

                              <small class="text-muted text-truncate d-block mt-1" style="font-size: 0.75rem;">
                                Autor: {{ file.email || 'N/A' }}
                              </small>
                            </div>
                            
                            <div class="d-flex align-items-center gap-1 flex-shrink-0" (click)="$event.stopPropagation()">
                              <button
                                type="button"
                                (click)="selectAndCompile(file._id)"
                                [disabled]="isCompiling()"
                                class="btn btn-sm btn-outline-info px-2 py-1 shadow-sm"
                                title="Cargar archivo"
                              >
                                <i class="bi bi-folder-symlink"></i>
                              </button>

                              <button
                                type="button"
                                (click)="removeText(file._id)"
                                [disabled]="isCompiling()"
                                class="btn btn-sm btn-outline-danger px-2 py-1 shadow-sm"
                                title="Eliminar archivo"
                              >
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </li>
                        }
                      </ul>
                    } @else {
                      <div class="font-monospace small text-muted bg-light p-2 rounded">
                        {{ noteFiles() }}
                      </div>
                    }
                  } @else {
                    <p class="text-muted small text-center my-4">No hay archivos asociados.</p>
                  }
                </div>
              </div>
            </div>
          }
        </div>
        
        <!-- MODAL PARA INGRESAR TÍTULO DE NUEVO DOCUMENTO -->
        @if (showCreateModal()) {
          <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content shadow-lg border-0">
                <div class="modal-header bg-dark text-white py-3">
                  <h5 class="modal-title">
                    <i class="bi bi-file-earmark-plus me-2"></i> Crear Nuevo Documento
                  </h5>
                </div>

                <div class="modal-body p-4">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Título del Archivo / Documento</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Ej: mi_articulo_cientifico"
                      [(ngModel)]="newFileTitle"
                      name="newFileTitle"
                      required
                    />
                    <small class="text-muted mt-1 d-block">Se guardará con la extensión .tex automáticamente.</small>
                  </div>
                </div>

                <div class="modal-footer bg-light py-3">
                  <button type="button" class="btn btn-secondary" (click)="closeCreateModal()">Cancelar</button>
                  <button type="button" class="btn btn-primary" (click)="createText()">
                    Confirmar y Crear
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
    </div>
  `,
  styles: [`
    .editor-main-wrapper {
      position: relative;
      background-color: #fafbfc;
      height: 65vh;
    }

    .line-numbers {
      width: 50px;
      font-size: 0.95rem;
      line-height: 1.5;
      user-select: none;
      background-color: #f1f3f5;
      overflow: hidden;
      white-space: pre;
      z-index: 2;
    }

    .syntax-highlight-layer {
      font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 0.95rem;
      line-height: 1.5;
      color: #24292e;
      background: transparent !important;
      pointer-events: none;
      white-space: pre-wrap;
      word-break: break-word;
      overflow: hidden;
    }

    .code-editor {
      font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 0.95rem;
      line-height: 1.5;
      background-color: transparent !important;
      color: transparent !important;
      caret-color: #24292e;
      resize: none;
      tab-size: 2;
      white-space: pre-wrap;
      word-break: break-word;
      overflow-y: auto;
    }

    .code-editor:focus {
      outline: none;
      box-shadow: none;
    }

    /* Colores del Syntax Highlighter */
    ::ng-deep .token-comment { color: #6a737d; font-style: italic; }
    ::ng-deep .token-keyword { color: #d73a49; font-weight: bold; }
    ::ng-deep .token-command { color: #005cc5; }
    ::ng-deep .token-bracket { color: #e36209; }
    ::ng-deep .token-math { color: #6f42c1; }

    .floating-compile-btn {
      border-radius: 50rem;
      backdrop-filter: blur(4px);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .floating-compile-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }

    .file-item {
      transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    }

    .file-item:hover {
      background-color: #f1f3f5;
    }

    .error-log-box {
      font-family: 'Fira Code', Consolas, monospace;
      font-size: 0.8rem;
      overflow-y: auto;
      background-color: #f8d7da;
      color: #842029;
      padding: 10px;
      border-radius: 4px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  `]
})
export class CreateNoteComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  auth: any = isAuth();
  readonly apiUrl = `${environment.apiURL}/api`;
  readonly apiUrlfile = `${environment.apiURL}`;

  // Signals reactivos
  public noteText = signal<string>('');
  public noteFiles = signal<any>('');
  public selectedTitle = signal<string>('www.tex');
  public isCompiling = signal<boolean>(false);
  public lastPdfBlob = signal<Blob | null>(null);

  public isSidebarVisible = signal<boolean>(true);
  public showCreateModal = signal<boolean>(false);
  public newFileTitle = signal<string>('documento_nuevo');
  public compilationError = signal<{ message: string; details?: string } | null>(null);

  public lineCountArray = computed(() => {
    const text = this.noteText() || '';
    const lines = text.split('\n').length;
    return new Array(Math.max(lines, 1));
  });

  // Signal calculada para generar el HTML con resaltado de sintaxis
  public highlightedCode = computed(() => {
    const text = this.noteText() || '';
    return this.escapeHtml(text)
      .replace(/(%.*)$/gm, '<span class="token-comment">$1</span>')
      .replace(/(\\documentclass|\\usepackage|\\begin|\\end|\\title|\\author|\\date|\\maketitle|\\section)/g, '<span class="token-keyword">$1</span>')
      .replace(/(\\[a-zA-Z]+)/g, (match) => {
        if (match.includes('documentclass') || match.includes('usepackage') || match.includes('begin') || match.includes('end') || match.includes('title') || match.includes('author') || match.includes('date') || match.includes('maketitle') || match.includes('section')) {
          return match;
        }
        return `<span class="token-command">${match}</span>`;
      })
      .replace(/([\[\]\{\}])/g, '<span class="token-bracket">$1</span>');
  });

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  ngOnInit(): void {
    const user = this.authUser();
    if (user && user._id) {
      this.loadNoteData();
    }
  }

  public authUser(): any {
    return typeof this.auth === 'function' ? this.auth() : this.auth;
  }

  public isArray(value: any): boolean {
    return Array.isArray(value);
  }

  public clearError(): void {
    this.compilationError.set(null);
    this.cdr.markForCheck();
  }

  public toggleSidebar(): void {
    this.isSidebarVisible.update(visible => !visible);
    this.cdr.markForCheck();
  }

  public onTextChange(value: string): void {
    this.noteText.set(value);
  }

  public syncScroll(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const wrapper = textarea.parentElement;
    if (wrapper) {
      const lineNumbersDiv = wrapper.previousElementSibling as HTMLElement;
      const syntaxLayer = wrapper.querySelector('.syntax-highlight-layer') as HTMLElement;
      if (lineNumbersDiv) lineNumbersDiv.scrollTop = textarea.scrollTop;
      if (syntaxLayer) {
        syntaxLayer.scrollTop = textarea.scrollTop;
        syntaxLayer.scrollLeft = textarea.scrollLeft;
      }
    }
  }

  public openCreateModal(): void {
    this.newFileTitle.set('');
    this.showCreateModal.set(true);
    this.cdr.markForCheck();
  }

  public closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.cdr.markForCheck();
  }

  public viewPdf(): void {
    const blob = this.lastPdfBlob();
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);
  }

  public selectFile(file: any): void {
    if (file) {
      this.selectedTitle.set(file.atachtitle || 'www.tex');
      this.noteText.set(file.contenido || '');
      this.cdr.markForCheck();
    }
  }

  public selectAndCompile(id: string): void {
    this.loadNote(id);
  }

  public loadNoteData(): void {
    const userId = this.auth?._id;
    if (!userId) return;

    this.http.get<TextItem | TextItem[]>(`${this.apiUrl}/articles/newwwww/${userId}`).subscribe({
      next: (rawData) => {
        const item = Array.isArray(rawData) ? rawData[0] : rawData;

        if (item) {
          this.noteFiles.set(item.files || '');
          if (item.files && item.files.length > 0) {
            const file = item.files[0];
            this.selectAndCompile(file._id);
          }
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Error obteniendo los datos de la nota.');
        this.cdr.markForCheck();
      }
    });
  }

  public loadNote(id: any): void {
    if (!id) return;
    this.http.get<TextItem | TextItem[]>(`${this.apiUrl}/articles/zzzone/${id}`).subscribe({
      next: (rawData) => {
        const item = Array.isArray(rawData) ? rawData[0] : rawData;
        if (item) {
          this.noteText.set(item.contenido || '');
          if (item.atachtitle) {
            this.selectedTitle.set(item.atachtitle);
          }
          this.toastr.info(`Cargado archivo: ${item.title || 'Sin título'}`);
        }

        this.cdr.markForCheck();
      },
      error: () => {
        this.toastr.error('Error obteniendo los datos de la nota.');
        this.cdr.markForCheck();
      }
    });
  }

  public updateNote(id: any, event: FocusEvent): void {
    if (!id) return;

    const target = event.target as HTMLElement;
    const newTitleText = target.innerText.trim();

    if (!newTitleText) {
      this.toastr.warning('El título no puede estar vacío.');
      this.loadNoteData();
      return;
    }

    const titleToSend = newTitleText.endsWith('.tex') ? newTitleText : `${newTitleText}.tex`;

    this.http.put<any>(`${this.apiUrl}/articles/newwwww/${id}`, { title: `${titleToSend}` }).subscribe({
      next: (response) => {
        this.toastr.success('Título actualizado correctamente');
        if (this.selectedTitle() === id || target.classList.contains('border-primary')) {
          this.selectedTitle.set(response.title || titleToSend);
        }
        this.loadNoteData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al actualizar el título:', err);
        this.toastr.error('No se pudo actualizar el título del archivo.');
        this.loadNoteData();
        this.cdr.markForCheck();
      }
    });
  }

  public getDisplayName(title: string): string {
    if (!title) return 'Sin título';
    return title.endsWith('.tex') ? title.slice(0, -4) : title;
  }

  public sendEditedText(title: any): void {
    this.isCompiling.set(true);
    this.clearError();
    this.cdr.markForCheck();

    const currentText = this.noteText();
    const targetTitle = title || this.selectedTitle() || 'www.tex';
    
    const payload = {
      contenido: currentText,
      title: targetTitle,
      updatedAt: new Date().toISOString()
    };

    this.http.post(
      `${this.apiUrl}/articles/wwnewwwww`,
      payload,
      {
        observe: 'response',
        responseType: 'blob'
      }
    ).subscribe({
      next: (response) => {
        const pdf = response.body;
        const compileTime = response.headers.get('X-Compile-Time') || '0';

        if (!pdf) {
          this.toastr.error('El servidor no devolvió el PDF.');
          this.isCompiling.set(false);
          this.cdr.markForCheck();
          return;
        }

        const blob = new Blob([pdf], { type: 'application/pdf' });
        this.lastPdfBlob.set(blob);

        this.toastr.success(`PDF generado para "${targetTitle}" en ${compileTime} segundos`);

        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 10000);

        this.isCompiling.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al compilar:', err);

        if (err.error instanceof Blob) {
          err.error.text().then((text: string) => {
            let mensajePrincipal = 'Error al compilar el documento LaTeX/Asymptote.';
            let detalleLog = '';

            try {
              const data = JSON.parse(text);
              mensajePrincipal = data.message || data.error || mensajePrincipal;

              if (data.details || data.stderr) {
                detalleLog = data.details || data.stderr;
              }
            } catch {
              if (text && text.trim().length > 0) {
                detalleLog = text;
              }
            }

            this.compilationError.set({
              message: mensajePrincipal,
              details: detalleLog
            });

            this.isCompiling.set(false);
            this.cdr.markForCheck();
          }).catch(() => {
            this.compilationError.set({
              message: 'Error al leer la respuesta de error del servidor.'
            });
            this.isCompiling.set(false);
            this.cdr.markForCheck();
          });
        } else {
          const mensajeError = err?.error?.details || err?.error?.message || err?.error?.error || err?.message || 'Error al conectar con el servidor de compilación 3D.';
          this.compilationError.set({
            message: mensajeError
          });
          this.isCompiling.set(false);
          this.cdr.markForCheck();
        }
      }
    });
  }

  public removeText(id: any): void {
    if (!confirm('¿Confirma que desea eliminar este archivo/documento?')) {
      return;
    }

    this.isCompiling.set(true);
    this.clearError();
    this.cdr.markForCheck();

    this.http.delete(`${this.apiUrl}/articles/newwwww/${id}`).subscribe({
      next: () => {
        this.toastr.success('Documento eliminado correctamente');
        this.loadNoteData();
        this.isCompiling.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.toastr.error('No se pudo eliminar el documento');
        this.isCompiling.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  public createText(): void {
    this.closeCreateModal();
    this.isCompiling.set(true);

    const defaultLatexContent = `\\documentclass[a4paper, 12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[spanish]{babel}
\\usepackage{amsmath, amssymb}
\\usepackage{graphicx}
\\usepackage{asymptote}
\\usepackage{mlmodern}
\\usepackage[margin=2.5cm]{geometry}

\\title{Ejemplo de LaTeX con Ecuaciones y Gráfico 3D en Asymptote}
\\author{Generado por Asistente IA}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introducción}
En este documento se muestra la representación matemática y visual de una superficie paramétrica tridimensional. Las herramientas de gráficos vectoriales como \\textbf{Asymptote} permiten renderizar figuras geométricas con calidad tipográfica exacta a la del documento.

\\section{Formulación Matemática}
La superficie analizada corresponde a un \\textbf{paraboloide hiperbólico} (comúnmente conocido como "silla de montar"), definido por la siguiente función escalar en coordenadas cartesianas:

\\begin{equation}
    f(x, y) = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}
    \\label{eq:paraboloide}
\\end{equation}

Alternativamente, podemos expresar el sistema mediante parametrización vectorial:

\\begin{align}
    x(u, v) &= u \\\\
    y(u, v) &= v \\\\
    z(u, v) &= u^2 - v^2
    \\label{eq:param}
\\end{align}

\\end{document}`;

    const titleToSend = this.newFileTitle() || 'documento_nuevo';

    this.http.post<{ contenido: string }>(`${this.apiUrl}/articles/createnewtext`, {
      contenido: defaultLatexContent,
      title: titleToSend,
      description: "Documento LaTeX con Asymptote 3D generado automáticamente",
      user: this.auth?._id,
      email: this.auth?.email,
      folder: "folder"
        }).subscribe({
      next: (response) => {
        if (response?.contenido) {
          this.noteText.set(defaultLatexContent);
          this.selectedTitle.set(titleToSend);
          this.toastr.success(`Documento "${titleToSend}" creado y cargado correctamente`);
          this.loadNoteData();
        }
        this.isCompiling.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isCompiling.set(false);
        this.toastr.error('No se pudo enviar ni cargar el texto predeterminado');
        this.cdr.markForCheck();
      }
    });
  }
}