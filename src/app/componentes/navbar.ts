import { signout, isAuth } from './auth';
import { Component, ChangeDetectionStrategy, signal, inject, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg px-0">
      <div class="container px-2 d-flex justify-content-between align-items-center flex-nowrap position-relative">
        
        <!-- 1. Marca / Logo (Izquierda) -->
        <a class="navbar-brand" routerLink="/" (click)="closeMenu()">
          <i class="bi bi-house brand-icon"></i>
        </a>

        <!-- 2. Botón Hamburguesa (Derecha) -->
        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          (click)="toggleMenu(); $event.stopPropagation()"
          [attr.aria-expanded]="isMenuOpen()"
          aria-label="Alternar navegación">
          <i class="bi bi-list brand-icon"></i>
        </button>

        <!-- 3. Contenido colapsable (Menú desplegable absoluto debajo del icono) -->
        <div class="collapse navbar-collapse flex-grow-0 text-end" [class.show]="isMenuOpen()">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 custom-nav-links">
            <li class="nav-item">
              <a class="nav-link ffont" routerLink="/documentos" routerLinkActive="active" (click)="closeMenu()">
                Documentos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link ffont" routerLink="/land" routerLinkActive="active" (click)="closeMenu()">
                Vector
              </a>
            </li>
            @if (auth) {
              <li class="nav-item">
                <a class="nav-link ffont" routerLink="/panel" routerLinkActive="active" (click)="closeMenu()">
                  Panel
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link text-warning fw-semibold ffont"
                  routerLink="/actualizarusuario"
                  routerLinkActive="active"
                  (click)="closeMenu()">
                  {{ auth?.name?.initial || userInitials }}
                </a>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link ffont" routerLink="/login" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">
                  Iniciar
                </a>
              </li>
            }
          </ul>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      z-index: 12;
      position: absolute;
      width: 100%;
      background: transparent;
      box-shadow: none;
    }
    .brand-icon {
      color: #075b63ff;
      font-size: 34px;
    }
    .custom-nav-links .nav-link {
      color: #075b63ff !important;
    }
    .custom-nav-links .nav-link:hover {
      color: #075b63ff !important;
    }
    
    /* Posicionamiento móvil exacto debajo del botón/icono */
    @media (max-width: 991.98px) {
      .navbar-collapse {
        position: absolute;
        top: 100%;
        right: 0.5rem;
        min-width: 200px;
      }
      .navbar-collapse.show {
        background: rgba(2, 6, 23, 0.90);
        backdrop-filter: blur(12px);
        padding: 1.25rem;
        border-radius: 1rem;
        margin-top: 0.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  
  readonly isMenuOpen = signal(false);
  auth: any = isAuth();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isMenuOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  get userInitials(): string {
    if (!this.auth?.name) return '';
    const parts = this.auth.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  onSignOut(): void {
    signout(() => {
      this.auth = isAuth();
      this.closeMenu();
      this.router.navigate(['/']);
    });
  }
}