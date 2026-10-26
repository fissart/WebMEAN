import {
  Component,
  OnInit,
  signal,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  type Signal
} from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isAuth } from './auth';
// import { ThreeHtmlCanvasComponent } from './logomodel3d';

type ModalType = 'mapa' | 'streetview';

interface SocialLink {
  readonly label: string;
  readonly url: string;
  readonly iconClass: string;
  readonly color: string;
}

interface NavButton {
  readonly label: string;
  readonly route: string;
  readonly iconClass: string;
  readonly isDynamic?: boolean;
}

// Categorías para organizar en el acordeón
interface NavCategory {
  readonly title: string;
  readonly icon: string;
  readonly buttons: readonly NavButton[];
}

const NAV_CATEGORIES: readonly NavCategory[] = [
  {
    title: 'Académico e Institucional',
    icon: 'bi bi-mortarboard-fill',
    buttons: [
      { label: 'Trámite (Mesa de partes)', route: 'tramite', iconClass: 'bi bi-receipt' },
      { label: 'Carreras', route: 'carreras', iconClass: 'bi bi-star' },
      { label: 'Cursos', route: 'courses', iconClass: 'bi bi-mortarboard-fill' }, // Corregido 'curses' -> 'courses'
      { label: 'Artículos científicos', route: 'articulo', iconClass: 'bi bi-journal-text' },
      { label: 'Estadística institucional', route: 'stats', iconClass: 'bi bi-bar-chart-fill' },
      { label: 'Blog', route: 'blog', iconClass: 'bi bi-file-post' },
    ]
  },
  {
    title: 'Arte, Cultura y Creación', // Nombre más descriptivo
    icon: 'bi bi-brush-fill', // Corregido para incluir el prefijo 'bi '
    buttons: [
      { label: 'Museo virtual', route: 'exhibicion', iconClass: 'bi bi-bank' },
      { label: 'Pintura digital', route: 'pintura', iconClass: 'bi bi-palette' },
      { label: 'Editor de imágenes', route: 'imagen', iconClass: 'bi bi-image' },
      { label: 'Editor de objetos 3D', route: 'blender', iconClass: 'bi bi-bezier2' },
      { label: 'Editor LaTeX', route: 'latex', iconClass: 'bi bi-text-right' }, // Ruta y etiqueta estandarizadas
    ]
  },
  {
    title: 'Herramientas y Utilidades',
    icon: 'bi bi-gear-fill', // Corregido para incluir el prefijo 'bi '
    buttons: [
      { label: 'Audio HD', route: 'audio', iconClass: 'bi bi-badge-hd' },
      { label: 'Videoconferencia', route: 'video', iconClass: 'bi bi-camera-video-fill', isDynamic: true },
      { label: 'Videojuego', route: 'game', iconClass: 'bi bi-controller' },
    ]
  }
]

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'WhatsApp', url: 'https://api.whatsapp.com/send?phone=+51966999215&text=Hola%20bienvenido', iconClass: 'bi bi-whatsapp', color: '#069d12' },
  { label: 'Facebook', url: 'https://web.facebook.com/bellasartes.ayacucho', iconClass: 'bi bi-facebook', color: '#0672a0' },
  { label: 'Messenger', url: 'https://m.me/bellasartes.ayacucho', iconClass: 'bi bi-messenger', color: '#00B2FF' },
  { label: 'Instagram', url: 'https://instagram.com/bellasartes.ayacucho', iconClass: 'bi bi-instagram', color: '#ff00ee' },
  { label: 'Google / Blogspot', url: 'https://bellasartes.blogspot.com', iconClass: 'bi bi-google', color: '#ff4800' },
  { label: 'YouTube', url: 'https://www.youtube.com/channel/UCkYf1NyZ1kUl3965WgeL6rw', iconClass: 'bi bi-youtube', color: '#ff0011' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@bellasartes.ayacucho', iconClass: 'bi bi-tiktok', color: '#8531caff' }
];

@Component({
  selector: 'app-wwwwww',
  standalone: true,
  // imports: [ThreeHtmlCanvasComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Modal genérico para Mapas / StreetView -->
    <dialog #mapDialog class="custom-native-modal shadow-lg" (click)="onDialogClick($event, mapDialog)">
      <div class="modal-content bg-dark text-light border-secondary h-100 d-flex flex-column">
        <div class="modal-header border-secondary p-3 d-flex justify-content-between align-items-center flex-shrink-0">
          <h5 class="modal-title mb-0">{{ modalTitle() }}</h5>
          <!-- <button type="button" class="btn-close btn-close-white" (click)="closeMapModal()"></button> -->
        </div>
        <div class="modal-body p-0 flex-grow-1 h-100 overflow-hidden">
          @if (currentIframeUrl(); as iframeUrl) {
            <iframe
              [src]="iframeUrl"
              [title]="modalTitle()"
              allowfullscreen
              loading="lazy"
              class="w-100 h-100 d-block border-0"
            ></iframe>
          }
        </div>
        <div class="modal-footer p-2 border-secondary d-flex justify-content-end">
          <button type="button" class="btn btn-secondary" (click)="closeMapModal()">Cerrar</button>
        </div>
      </div>
    </dialog>

    <!-- Modal con Acordeón para los Botones de Navegación -->
    <dialog #menuDialog class="custom-native-modal shadow-lg p-0 border-0 rounded-3" (click)="onDialogClick($event, menuDialog)">
      <div class="modal-content bg-white text-dark border-0 h-100 d-flex flex-column">
        <div class="modal-header border-bottom border-light p-3 d-flex justify-content-between align-items-center flex-shrink-0 bg-light rounded-top-3">
          <h5 class="modal-title mb-0 fw-semibold text-secondary"><i class="bi bi-grid-fill me-2 text-primary"></i> Menú de Navegación</h5>
        </div>
        
        <div class="modal-body p-3 flex-grow-1 overflow-auto custom-scrollbar">
          <!-- Acordeón personalizado controlado por Signal -->
          <div class="accordion accordion-flush" id="navAccordion">
            @for (cat of navCategories; track cat.title; let i = $index) {
              @let isOpen = activeCategoryIndex() === i;
              <div class="accordion-item bg-white border border-light mb-2 rounded overflow-hidden shadow-sm">
                <h2 class="accordion-header" [id]="'heading' + i">
                  <button 
                    class="accordion-button bg-white text-dark fw-medium shadow-none py-3 px-3" 
                    [class.collapsed]="!isOpen"
                    type="button" 
                    (click)="toggleCategory(i)"
                    [attr.aria-expanded]="isOpen" 
                    [attr.aria-controls]="'collapse' + i"
                  >
                    <i [class]="cat.icon + ' me-2 text-secondary fs-5'"></i> 
                    <span class="flex-grow-1">{{ cat.title }}</span>
                  </button>
                </h2>
                
                @if (isOpen) {
                  <div [id]="'collapse' + i" class="accordion-collapse show" [attr.aria-labelledby]="'heading' + i">
                    <div class="accordion-body bg-light bg-opacity-50 d-flex flex-column gap-2 p-3 pt-0">
                      @for (btn of cat.buttons; track btn.label) {
                        <button 
                          type="button"
                          class="btn btn-light border border-info border-opacity-25 text-dark text-start d-flex align-items-center gap-3 py-2 px-3 action-btn-hover shadow-sm" 
                          (click)="navigateTo(btn)"
                        >
                          <i [class]="btn.iconClass + ' text-warning fs-6'"></i>
                          <span class="small fw-medium">{{ btn.label }}</span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <div class="modal-footer p-3 border-top border-light bg-light d-flex justify-content-end rounded-bottom-3">
          <button type="button" class="btn btn-outline-secondary px-4" (click)="closeMenuModal()">Cerrar</button>
        </div>
      </div>
    </dialog>


    <div class="">
      <!-- Información Institucional -->
      <div class="text-center">
        <h3 class=" my-0 ffont text-primary">
          ESCUELA SUPERIOR DE FORMACIÓN ARTÍSTICA
        </h3>
        <div class="h6 ffont text-primary">"FELIPE GUAMÁN POMA DE AYALA"</div>

        <!-- <div class="text-center" style="height: 6cm;">
          <app-three-html-canvas></app-three-html-canvas>
        </div> -->

        <!-- Botón único para desplegar el Modal con Acordeón de Navegación -->
        <div class="w-100 py-3 d-flex justify-content-center">
          <button 
            type="button"
            class="btn btn-outline-warning gap-1 d-flex align-items-center init-hover" 
            (click)="openMenuModal()"
          >
            <i class="bi bi-list"></i>
            <span>MENÚ INSTITUCIONAL</span>
          </button>
        </div>
      </div>


<!-- Dirección -->
      <div class="text-center">
        <div class="mb-0 style-location ffont" [style]="'font-size: .8em'">
          Jr. Mariano Melgar Nº 398, Distrito Jesús Nazareno - Huamanga, Ayacucho.
          Teléfono: 066-287499
        </div>
      </div>

      <!-- Redes Sociales y Modales de Mapas -->
      <div class="text-center">
        <div class="text-muted ffont" [style]="'font-size: .8em'">
          Copyright &copy; ESFAPA Ayacucho {{ currentYear }}
        </div>
      </div>

      <div class="d-flex justify-content-center flex-wrap gap-1 my-2  mt-3">
        <button
          type="button"
          class="btn p-1"
          aria-label="Ver Street View"
          (click)="openMapModal('streetview')"
        >
          <i style="font-size: 26px; color: #15b5a7;" class="bi bi-person-walking"></i> 
        </button>
        <button
          type="button"
          class="btn p-1"
          aria-label="Ver Mapa"
          (click)="openMapModal('mapa')"
        >
          <i style="font-size: 26px; color: #1b39d4;" class="bi bi-geo-alt-fill"></i> 
        </button>

        @for (social of socialLinks; track social.label) {
          <button
            type="button"
            class="btn p-1"
            [attr.aria-label]="social.label"
            (click)="openInNewTab(social.url)"
          >
            <i
              [class]="social.iconClass"
              [style.color]="social.color"
              style="font-size: 26px;"
            ></i>
          </button>
        }
      </div>

      
    </div>
  `,
  styles: [`
    .style-subtext {
      font-size: 0.75rem;
    }

    .style-location {
      font-size: 0.9rem;
    }

    .action-btn-hover {
      transition: all 0.2s ease-in-out;
    }
    
    .action-btn-hover:hover {
      background-color: rgba(13, 110, 253, 0.15) !important;
      border-color: rgba(13, 110, 253, 0.4) !important;
      transform: translateX(4px);
    }

    .init-hover:hover {
    padding: 0.85rem 1.25rem; /* Ajusta el alto (vertical) y ancho (horizontal) */
  font-size: 1.05rem;      /* Tamaño del texto */
  border-radius: 8px;      /* Bordes ligeramente más redondeados si lo deseas */
    }

    .custom-native-modal {
      width: 90vw;
      height: 80vh;
      max-width: 600px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 0;
      background: #0f172a;
      margin: auto;
    }

    .custom-native-modal::backdrop {
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
    }
  `]
})
export class WwwwwwComponent implements OnInit {
  @ViewChild('mapDialog') private readonly mapDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('menuDialog') private readonly menuDialog!: ElementRef<HTMLDialogElement>;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  readonly imageSrc = signal<string>('');
  readonly auth: Signal<any> = signal(isAuth());

  readonly currentIframeUrl = signal<SafeResourceUrl | null>(null);
  readonly modalTitle = signal<string>('');

  // Señal para rastrear qué acordeón está abierto actualmente (null = todos cerrados)
  readonly activeCategoryIndex = signal<number | null>(null);

  readonly socialLinks = SOCIAL_LINKS;
  readonly navCategories = NAV_CATEGORIES;

  private readonly iframeSources: Record<ModalType, { title: string; url: SafeResourceUrl }> = {
    mapa: {
      title: 'Ubicación - ESFAPA Ayacucho',
      url: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://maps.google.com/maps?width=100%25&height=500&hl=es&q=+(Escuela%20de%20Bellas%20Artes%20Felipe%20Guam%C3%A1n%20Poma%20de%20Ayala-Ayacucho)&t=k&z=18&ie=UTF8&iwloc=B&output=embed'
      )
    },
    streetview: {
      title: 'Street View - ESFAPA Ayacucho',
      url: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!4v1750534065961!6m8!1m7!1syWFe4Rj4ga1j6fqlrkocMA!2m2!1d-13.15626194436401!2d-74.21787224051161!3f200.16657941141062!4f3.2355809602561294!5f0.7820865974627469'
      )
    }
  };

  ngOnInit(): void {
    const day = new Date().getDay();
    const svgIndex = day === 0 ? 7 : day;
    this.imageSrc.set(`/www${svgIndex}.svg`);
  }

  openMapModal(type: ModalType): void {
    const selectedSource = this.iframeSources[type];
    this.modalTitle.set(selectedSource.title);
    this.currentIframeUrl.set(selectedSource.url);

    if (this.mapDialog?.nativeElement) {
      this.mapDialog.nativeElement.showModal();
    }
  }

  closeMapModal(): void {
    if (this.mapDialog?.nativeElement?.open) {
      this.mapDialog.nativeElement.close();
    }
    this.currentIframeUrl.set(null);
  }

  openMenuModal(): void {
    if (this.menuDialog?.nativeElement) {
      this.menuDialog.nativeElement.showModal();
    }
  }

  closeMenuModal(): void {
    if (this.menuDialog?.nativeElement?.open) {
      this.menuDialog.nativeElement.close();
    }
    // Opcional: Reiniciar el acordeón al cerrar el modal
    this.activeCategoryIndex.set(null);
  }

  /**
   * Alterna el estado del acordeón: si ya está abierto, lo cierra (null); si está cerrado, lo abre.
   */
  toggleCategory(index: number): void {
    this.activeCategoryIndex.update((current) => (current === index ? null : index));
  }

  onDialogClick(event: MouseEvent, dialogElement: HTMLDialogElement): void {
    const rect = dialogElement.getBoundingClientRect();
    const isClickOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (isClickOutside) {
      dialogElement.close();
      if (dialogElement === this.mapDialog?.nativeElement) {
        this.currentIframeUrl.set(null);
      }
      if (dialogElement === this.menuDialog?.nativeElement) {
        this.activeCategoryIndex.set(null);
      }
    }
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  navigateTo(btn: NavButton): void {
    this.closeMenuModal();
    if (btn.isDynamic) {
      const randomRoomId = Math.random().toString(36).substring(2, 11).toUpperCase();
      this.router.navigate([`/${btn.route}`, randomRoomId]);
      return;
    }
    this.router.navigate([btn.route]);
  }
}