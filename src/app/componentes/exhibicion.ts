import { 
  Component, 
  Injectable, 
  Signal, 
  WritableSignal, 
  signal, 
  computed, 
  inject, 
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { Navbar } from './navbar';
import { isAuth } from './auth';
import { ShoppingCartComponent } from './exhibitionshop'
export interface Exhibition {
  _id?: string;
  id?: number | string;
  title: string;
  user: string;
  category: string;
  detail: string;
  imageUrl: string;
  curator: string;
}

@Injectable({
  providedIn: 'root'
})
export class MuseumService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiURL}/api`;
  private baseUrl = environment.apiURL || '';

  private exhibitionsSignal: WritableSignal<Exhibition[]> = signal([]);
  readonly exhibitions: Signal<Exhibition[]> = this.exhibitionsSignal.asReadonly();

  private formatImageUrl(item: Exhibition): Exhibition {
    if (!item.imageUrl) return item;
    if (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://')) {
      return item;
    }
    const cleanPath = item.imageUrl.startsWith('/') ? item.imageUrl : `/${item.imageUrl}`;
    return { 
      ...item, 
      imageUrl: `${this.baseUrl}${cleanPath}` 
    };
  }

  loadExhibitions(): void {
    this.http.get<Exhibition[]>(`${this.apiUrl}/exhibitions`).subscribe({
      next: (data) => {
        const formattedData = data.map((item) => this.formatImageUrl(item));
        this.exhibitionsSignal.set(formattedData);
      },
      error: (err) => {
        console.warn('Backend no disponible. Cargando datos por defecto:', err);
        if (this.exhibitionsSignal().length === 0) {
          this.exhibitionsSignal.set([
            {
              id: '1',
              title: 'Cultura Preincaica',
              category: 'Historia',
              user: 'admin@museum.org',
              detail: 'Muestra virtual de ceramios e imaginería ancestral.',
              imageUrl: 'https://picsum.photos/seed/history/600/400',
              curator: 'Juan Pérez'
            }
          ]);
        }
      }
    });
  }

  createExhibition(formData: FormData): void {
    this.http.post<Exhibition>(`${this.apiUrl}/exhibitions`, formData).subscribe({
      next: (newExhibition) => {
        const formatted = this.formatImageUrl(newExhibition);
        this.exhibitionsSignal.update((list) => [formatted, ...list]);
      },
      error: (err) => console.error('Error al guardar exposición:', err)
    });
  }

  updateExhibition(id: string | number, formData: FormData): void {
    this.http.put<Exhibition>(`${this.apiUrl}/exhibitions/${id}`, formData).subscribe({
      next: (updated) => {
        const formatted = this.formatImageUrl(updated);
        this.exhibitionsSignal.update((list) =>
          list.map((e) => ((e._id || e.id) === id ? formatted : e))
        );
      },
      error: (err) => console.error('Error al actualizar exposición:', err)
    });
  }

  deleteExhibition(id: string | number): void {
    this.http.delete(`${this.apiUrl}/exhibitions/${id}`).subscribe({
      next: () => {
        this.exhibitionsSignal.update((list) => list.filter((e) => (e._id || e.id) !== id));
      },
      error: (err) => console.error('Error al eliminar exposición:', err)
    });
  }
}

@Component({
  selector: 'app-virtual-museum',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, Navbar, ShoppingCartComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="py-5"></div>


<app-shopping-cart/>
    <div class="museum-container p-1">
      <header class="museum-header">
        <h1>Museo Virtual Interactivo</h1>
        <p>Plataforma para que cada usuario cure y organice sus propias salas temáticas</p>
      </header>

      <section class="toolbar">
        <input 
          type="text" 
          placeholder="Buscar temática o curador..." 
          [ngModel]="searchTerm()"
          (ngModelChange)="onSearchChange($event)"
          class="input-search"
        />
        
        <select [ngModel]="selectedCategory()" (ngModelChange)="selectedCategory.set($event)" class="select-category">
          <option value="Todas">Todas las Categorías</option>
          @for (cat of categories(); track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>

        @if (auth) {
          <button class="btn btn-primary" (click)="openCreateModal()">
             Curar Nueva Sala
          </button>
        }
      </section>

     <main class="gallery-grid">
  @for (item of filteredExhibitions(); track (item._id || item.id || $index); let i = $index) {
    <article class="museum-card card bg-dark text-light border-secondary mb-4 shadow-sm">
      <div class="card-image-wrapper position-relative overflow-hidden">
        <img 
          [src]="item.imageUrl || ('https://picsum.photos/600/400?random=' + (item._id || item.id || i))" 
          [alt]="item.title"
          class="card-img-top object-fit-cover-style"
          loading="lazy"
        />
        <span class="badge badge-warning position-absolute style-badge">{{ item.category }}</span>
      </div>
      
      <div class="card-body d-flex flex-column">
        <h3 class="h5 font-weight-bold text-white mb-2">{{ item.title }}</h3>
        <p class="curator small mb-2">
          Curador: <strong class="text-warning">{{ item.curator }}</strong>
        </p>
        <p class="description small text-secondary mb-3 text-truncate-2">
          {{ item.detail }}
        </p>

        <div class="btn-group">
          <button 
            type="button" 
            class="btn btn-sm btn-warning" 
            title="Ir a la exposición" 
            [routerLink]="['/exhibicion', item._id || item.id, item.user]">
            <!-- <span class="text-uppercase small mr-1">Explorar</span> -->
            <i class="bi bi-sliders"></i>
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-light" 
            title="Ir a la exposición" 
            [routerLink]="['/model', item._id || item.id, item.user]">
            <!-- <span class="text-uppercase small mr-1">Game3d</span> -->
            <i class="bi bi-box-seam-fill"></i>
          </button>
          @if (auth && (item.curator === auth.name || auth.rol === '1')) {
            <button 
              type="button" 
              class="btn btn-sm btn-info" 
              title="Editar" 
              (click)="openEditModal(item)">
              <i class="bi bi-pencil-fill"></i>
            </button>

            <button 
              type="button" 
              class="btn btn-sm btn-danger" 
              title="Eliminar" 
              (click)="deleteItem(item._id || item.id)">
              <i class="bi bi-trash-fill"></i>
            </button>
          }
        </div>
      </div>
    </article>
  } @empty {
    <div class="empty-state text-center py-5 w-100">
      <p class="text-muted h5 font-italic">No se encontraron salas o temáticas en este museo.</p>
    </div>
  }
</main>
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <h2>{{ isEditing() ? 'Editar Sala del Museo' : 'Curar Nueva Sala' }}</h2>
            
            <form (ngSubmit)="saveExhibition()">
              <div class="form-group">
                <label>Título de la Sala / Temática</label>
                <input type="text" [(ngModel)]="formData.title" name="title" required placeholder="Ej: Arte Renacentista" />
              </div>

              <div class="form-group">
                <label>Categoría</label>
                <input type="text" [(ngModel)]="formData.category" name="category" required placeholder="Ej: Arte, Historia, Ciencia" />
              </div>

              <div class="form-group">
                <label>Subir imagen de la portada</label>
                <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="file-input" />
              </div>

              <div class="form-group">
                <label>Descripción curatorial</label>
                <textarea [(ngModel)]="formData.detail" name="detail" rows="3" placeholder="Resumen de la temática..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 100vh;
      padding: 20px;
    }
    .museum-container { max-width: 1200px; margin: 0 auto; }
    .museum-header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #2d3748; padding-bottom: 20px; }
    .museum-header h1 { font-size: 2.5rem; color: #38bdf8; margin: 0 0 10px 0; }
    .toolbar { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
    .input-search, .select-category { padding: 10px 14px; background-color: #1e293b; border: 1px solid #334155; color: #fff; border-radius: 6px; outline: none; }
    .input-search { flex: 1; min-width: 200px; }
    .btn { padding: 10px 18px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary { background-color: #0284c7; color: white; }
    .btn-primary:hover { background-color: #0369a1; }
    .btn-secondary { background-color: #475569; color: white; }
    .btn-secondary:hover { background-color: #334155; }
    .btn-danger { background-color: #e11d48; color: white; }
    .btn-danger:hover { background-color: #be123c; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
    .museum-card { background-color: #1e293b; border-radius: 10px; overflow: hidden; border: 1px solid #334155; display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .card-image-wrapper { position: relative; height: 200px; }
    .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .badge { position: absolute; top: 10px; right: 10px; background-color: rgba(15, 23, 42, 0.85); color: #38bdf8; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; border: 1px solid #38bdf8; }
    .card-content { padding: 15px; flex: 1; }
    .card-content h3 { margin: 0 0 8px 0; color: #f8fafc; }
    .curator { font-size: 0.85rem; color: #94a3b8; margin-bottom: 10px; }
    .description { font-size: 0.9rem; color: #cbd5e1; line-height: 1.4; }
    .card-actions { display: flex; gap: 10px; padding: 15px; background-color: #0f172a; border-top: 1px solid #334155; }
    .card-actions .btn { flex: 1; font-size: 0.85rem; }
    .modal-backdrop { position: fixed; inset: 0; background-color: rgba(0,0,0,0.75); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-card { background-color: #1e293b; padding: 25px; border-radius: 12px; width: 100%; max-width: 500px; border: 1px solid #475569; }
    .modal-card h2 { margin-top: 0; color: #38bdf8; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-size: 0.85rem; color: #94a3b8; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px 12px; background-color: #0f172a; border: 1px solid #334155; color: white; border-radius: 6px; box-sizing: border-box; }
    .file-input { background: transparent !important; border: none !important; padding: 0 !important; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b; }
    .style-badge {
  top: 12px;
  right: 12px;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.object-fit-cover-style {
  object-fit: cover;
  height: 220px;
}

/* Limita el texto a un máximo de 2 líneas */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
  `]
})
export class VirtualMuseumComponent implements OnInit {
  @ViewChild('fileInput') fileInputElement?: ElementRef<HTMLInputElement>;

  private museumService = inject(MuseumService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  auth: any = isAuth();

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('Todas');
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  currentEditId: string | number | null = null;
  selectedFile: File | null = null;

  formData: Omit<Exhibition, '_id' | 'id'> = {
    title: '',
    user: '',
    detail: '',
    category: '',
    imageUrl: '',
    curator: ''
  };

  categories = computed(() => {
    const list = this.museumService.exhibitions();
    const uniqueCategories = new Set(list.map((item) => item.category));
    return Array.from(uniqueCategories);
  });

  filteredExhibitions = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return this.museumService.exhibitions().filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.curator.toLowerCase().includes(search) ||
        item.detail.toLowerCase().includes(search);

      const matchesCategory = category === 'Todas' || item.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.searchTerm.set(params['search']);
      }
    });

    this.museumService.loadExhibitions();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: value || null },
      queryParamsHandling: 'merge'
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentEditId = null;
    this.selectedFile = null;
    this.formData = { title: '', user: '', category: '', detail: '', imageUrl: '', curator: '' };
    this.showModal.set(true);
  }

  openEditModal(item: Exhibition): void {
    this.isEditing.set(true);
    this.currentEditId = item._id || item.id || null;
    this.selectedFile = null;
    this.formData = {
      title: item.title,
      user: item.user || '',
      category: item.category,
      detail: item.detail,
      imageUrl: item.imageUrl,
      curator: item.curator
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedFile = null;
    if (this.fileInputElement?.nativeElement) {
      this.fileInputElement.nativeElement.value = '';
    }
  }

  saveExhibition(): void {
    if (!this.formData.title || !this.formData.category) return;

    const payload = new FormData();
    payload.append('title', this.formData.title);
    payload.append('type', 'general');
    if (this.auth?.email) payload.append('email', this.auth.email);
    payload.append('curator', this.auth?.name || this.formData.curator);
    if (this.auth?._id) payload.append('user', this.auth._id);
    payload.append('detail', this.formData.detail || '');
    payload.append('category', this.formData.category);

    if (this.selectedFile) {
      payload.append('image', this.selectedFile);
    }

    if (this.isEditing() && this.currentEditId !== null) {
      this.museumService.updateExhibition(this.currentEditId, payload);
    } else {
      this.museumService.createExhibition(payload);
    }

    this.closeModal();
  }

  deleteItem(id: string | number | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar esta temática del museo?')) {
      this.museumService.deleteExhibition(id);
    }
  }
}


