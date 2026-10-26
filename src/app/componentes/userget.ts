import { Component, OnInit, inject, output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { getCokie, signout } from './auth';

@Component({
  selector: 'app-user-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!-- Componente autónomo en segundo plano o con UI opcional -->`
})
export class UserLoaderComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Outputs modernos de Angular
  readonly userUpdated = output<any>();
  readonly onError = output<any>();

  ngOnInit(): void {
    this.fetchAndUpdateUser();
console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
  }

  public fetchAndUpdateUser(): void {
    try {
      // 1. Obtener el usuario almacenado en el localStorage
      const storedUserRaw = localStorage.getItem('user');
      if (!storedUserRaw) {
        console.warn('UserLoader: No se encontró información de usuario en el localStorage.');
        return;
      }

      const user = JSON.parse(storedUserRaw);
      const userId = user?._id || user?.id;

      if (!userId) {
        console.warn('UserLoader: El objeto de usuario en localStorage no contiene un ID válido (_id).');
        return;
      }

      // 2. Obtener el token de autorización (priorizando cookie, luego localStorage o sesión)
      const token = getCokie('token') || localStorage.getItem('token') || user?.token;

      const apiUrl = `${environment.apiURL}/api`;
      const headers = new HttpHeaders({
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      });

      // 3. Llamada HTTP GET para obtener los datos actualizados del usuario
      this.http.get<any>(`${apiUrl}/users/user/${userId}`, { headers }).subscribe({
        next: (freshUserData) => {
          // 4. Actualizar el localStorage combinando datos existentes con los frescos del servidor
          const updatedUserSession = { ...user, ...freshUserData };
          localStorage.setItem('user', JSON.stringify(updatedUserSession));

          // 5. Emitir al componente padre y forzar actualización de cambios si es necesario
          this.userUpdated.emit(updatedUserSession);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('UserLoader: Error al obtener el usuario del servidor:', err);

          if (err.status === 401) {
            signout(() => this.router.navigate(['/login']));
          }

          this.onError.emit(err);
          this.cdr.markForCheck();
        }
      });

    } catch (e) {
      console.error('UserLoader: Error crítico al procesar la sesión o el localStorage:', e);
    }
  }
}
