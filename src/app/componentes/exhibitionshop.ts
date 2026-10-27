import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { isAuth } from './auth';

// Definición de interfaz para el Producto
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

// Definición de interfaz para el Ítem del Carrito
interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Barra de navegación Bootstrap -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">
          <i class="bi bi-cart-check-fill me-2"></i>Tienda Moderna
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav align-items-center">
            <li class="nav-item me-3">
              <span class="badge" [ngClass]="authenticated() ? 'bg-success' : 'bg-warning text-dark'">
                <i class="bi" [ngClass]="authenticated() ? 'bi-shield-check' : 'bi-person'"></i>
                {{ authenticated() ? 'Sesión Autenticada' : 'Comprador Invitado' }}
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm position-relative" type="button">
                <i class="bi bi-cart3 me-1"></i> Carrito
                @if (totalItemsCount() > 0) {
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {{ totalItemsCount() }}
                  </span>
                }
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenedor de Alerta (Toast) -->
    @if (notificationMessage()) {
      <div class="position-fixed top-0 end-0 p-3" style="z-index: 1080;">
        <div class="toast show align-items-center text-white bg-success border-0 shadow-lg" role="alert">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
              <i class="bi bi-check-circle-fill fs-5 me-2"></i>
              <span>{{ notificationMessage() }}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="notificationMessage.set(null)"></button>
          </div>
        </div>
      </div>
    }

    <!-- Contenedor Principal -->
    <main class="container py-5">
      
      <!-- Banner de Bienvenida y Estado de Autenticación -->
      <div class="p-4 p-md-5 mb-5 rounded-4 text-white bg-primary shadow-lg position-relative overflow-hidden">
        <div class="position-relative z-1 row align-items-center">
          <div class="col-md-8 mb-3 mb-md-0">
            <h1 class="display-6 fw-bold mb-2">Tienda en Línea Moderna</h1>
            <p class="lead mb-0 text-white-50 fs-6">
              Descubre productos de alta calidad a precios inmejorables. Extremo de API configurado en 
              <code class="bg-dark bg-opacity-50 px-2 py-1 rounded text-info font-monospace small">{{ API_URL }}</code>
            </p>
          </div>
          <div class="col-md-4 text-md-end">
            <span class="badge bg-light text-dark px-3 py-2 rounded-pill shadow-sm">
              <span class="spinner-grow spinner-grow-sm me-1 text-success" role="status" aria-hidden="true"></span>
              {{ authenticated() ? 'Sesión Activa' : 'Modo Invitado' }}
            </span>
          </div>
        </div>
      </div>

      <div class="row g-4">
        
        <!-- Sección de Listado de Productos (8 Columnas) -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div class="row align-items-center g-3">
              <div class="col-sm-6">
                <h2 class="h5 fw-bold text-dark mb-0">
                  Productos Disponibles <span class="text-muted fs-6 fw-normal">({{ filteredProducts().length }})</span>
                </h2>
              </div>
              <div class="col-sm-6">
                <div class="input-group">
                  <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
                  <input 
                    type="text" 
                    [ngModel]="searchQuery()" 
                    (ngModelChange)="searchQuery.set($event)"
                    placeholder="Buscar productos..." 
                    class="form-control bg-light border-0 shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Cuadrícula de Productos -->
          <div class="row row-cols-1 row-cols-md-2 g-4">
            @for (product of filteredProducts(); track product.id) {
              <div class="col">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card">
                  <div class="position-relative bg-light" style="height: 200px;">
                    <img 
                      [src]="product.image" 
                      [alt]="product.name" 
                      class="w-100 h-100 object-fit-cover"
                      onerror="this.src='https://placehold.co/400x300/e2e8f0/64748b?text=Producto'"
                    />
                    <span class="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm rounded-pill px-3 py-1">
                      {{ product.category }}
                    </span>
                  </div>

                  <div class="card-body d-flex flex-column justify-content-between p-4">
                    <div>
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="h6 fw-bold text-dark mb-0">{{ product.name }}</h3>
                        <span class="text-primary fw-bold fs-5">S/{{ product.price.toFixed(2) }}</span>
                      </div>
                      <div class="d-flex align-items-center mb-3 text-warning small">
                        <i class="bi bi-star-fill me-1"></i>
                        <span class="text-dark fw-semibold me-2">{{ product.rating }}</span>
                        <span class="text-muted">({{ product.stock }} en stock)</span>
                      </div>
                    </div>

                    <button 
                      (click)="addToCart(product)"
                      class="btn btn-primary w-100 rounded-pill py-2 shadow-sm d-flex align-items-center justify-content-center gap-2">
                      <i class="bi bi-cart-plus"></i>
                      <span>Agregar al Carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4 text-center py-5 bg-white">
                  <div class="card-body">
                    <i class="bi bi-search fs-1 text-muted mb-2 d-block"></i>
                    <p class="text-muted mb-0">No hay productos que coincidan con tu búsqueda.</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Sección del Resumen del Carrito (4 Columnas) -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 2rem;">
            <div class="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
              <h2 class="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-bag-check text-primary"></i>
                <span>Tu Carrito</span>
              </h2>
              <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                {{ totalItemsCount() }} ítems
              </span>
            </div>

            <!-- Lista de Ítems en el Carrito -->
            <div class="cart-items-container overflow-y-auto pe-1 mb-3" style="max-height: 300px;">
              @for (item of cartItems(); track item.product.id) {
                <div class="d-flex align-items-center justify-content-between py-2 border-bottom border-light">
                  <div class="d-flex align-items-center gap-3">
                    <img [src]="item.product.image" class="rounded-3 object-fit-cover" width="45" height="45" alt="" />
                    <div>
                      <h6 class="small fw-bold text-dark mb-0">{{ item.product.name }}</h6>
                      <small class="text-muted">S/{{ item.product.price.toFixed(2) }} x {{ item.quantity }}</small>
                    </div>
                  </div>
                  
                  <div class="input-group input-group-sm w-auto" style="width: 100px !important;">
                    <button class="btn btn-outline-secondary px-2" type="button" (click)="updateQuantity(item.product.id, -1)">-</button>
                    <span class="form-control text-center bg-light border-secondary px-1">{{ item.quantity }}</span>
                    <button class="btn btn-outline-secondary px-2" type="button" (click)="updateQuantity(item.product.id, 1)">+</button>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-5">
                  <i class="bi bi-cartX display-4 text-muted mb-2 d-block"></i>
                  <p class="text-muted small mb-0">Tu carrito de compras está vacío.</p>
                </div>
              }
            </div>

            <!-- Desglose de Totales -->
            @if (cartItems().length > 0) {
              <div class="pt-3 border-top">
                <div class="d-flex justify-content-between small text-muted mb-2">
                  <span>Subtotal</span>
                  <span class="fw-semibold text-dark">S/{{ subtotal().toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between small text-muted mb-3">
                  <span>Impuesto estimado (8%)</span>
                  <span class="fw-semibold text-dark">S/{{ tax().toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold fs-5 text-dark pt-2 border-top mb-4">
                  <span>Total</span>
                  <span class="text-primary">S/{{ grandTotal().toFixed(2) }}</span>
                </div>

                <button 
                  (click)="checkout()"
                  class="btn btn-success w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-2">
                  <span>Proceder al Pago</span>
                  <i class="bi bi-arrow-right"></i>
                </button>

                <button 
                  (click)="clearCart()"
                  class="btn btn-light text-muted w-100 rounded-pill py-2 small">
                  Vaciar Carrito
                </button>
              </div>
            }
          </div>
        </div>

      </div>
    </main>

    <!-- Pie de página -->
    <footer class="bg-white border-top py-4 mt-5 text-center text-muted small">
      <div class="container">
        <p class="mb-0">&copy; 2026 Tienda en Línea E-Shop. Desarrollado con Angular 21 Standalone y Estilos Bootstrap.</p>
      </div>
    </footer>
  `,
  styles: [`
    .product-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.08) !important;
    }
  `]
})
export class ShoppingCartComponent implements OnInit {
  // Configuración obligatoria de la URL de la API obtenida del entorno
  readonly API_URL = `${environment.apiURL}/api`;

  // Signals de estado reactivo
  authenticated = signal<boolean>(false);
  searchQuery = signal<string>('');
  notificationMessage = signal<string | null>(null);

  // Base de datos simulada de productos
  products = signal<Product[]>([
    { id: 1, name: 'Auriculares inalámbricos con cancelación de ruido', price: 199.99, category: 'Electrónica', image: 'https://placehold.co/400x300/4f46e5/ffffff?text=Auriculares', rating: 4.8, stock: 15 },
    { id: 2, name: 'Teclado mecánico ergonómico', price: 129.50, category: 'Accesorios', image: 'https://placehold.co/400x300/7c3aed/ffffff?text=Teclado', rating: 4.6, stock: 8 },
    { id: 3, name: 'Monitor inteligente Ultra HD 4K', price: 349.00, category: 'Pantallas', image: 'https://placehold.co/400x300/2563eb/ffffff?text=Monitor', rating: 4.9, stock: 5 },
    { id: 4, name: 'Mochila minimalista de cuero', price: 89.99, category: 'Estilo de vida', image: 'https://placehold.co/400x300/0d9488/ffffff?text=Mochila', rating: 4.5, stock: 20 },
    { id: 5, name: 'Reloj inteligente de seguimiento físico', price: 79.99, category: 'Wearables', image: 'https://placehold.co/400x300/db2777/ffffff?text=Smartwatch', rating: 4.4, stock: 12 },
    { id: 6, name: 'Soporte portátil de aluminio para laptop', price: 45.00, category: 'Accesorios', image: 'https://placehold.co/400x300/ca8a04/ffffff?text=Soporte', rating: 4.7, stock: 25 }
  ]);

  // Estado de los ítems del carrito
  cartItems = signal<CartItem[]>([]);

  // Productos filtrados según la consulta de búsqueda
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.products();
    return this.products().filter(p => 
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  });

  // Totales calculados mediante computed
  totalItemsCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
  tax = computed(() => this.subtotal() * 0.08);
  grandTotal = computed(() => this.subtotal() + this.tax());

  ngOnInit(): void {
    const authStatus = isAuth();
    this.authenticated.set(typeof authStatus === 'boolean' ? authStatus : !!authStatus);
  }

  // Lógica para agregar producto al carrito
  addToCart(product: Product): void {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + 1 };
        return updated;
      }
      return [...items, { product, quantity: 1 }];
    });

    this.showNotification(`¡Se agregó "${product.name}" al carrito!`);
  }

  // Actualizar la cantidad de un ítem
  updateQuantity(productId: number, change: number): void {
    this.cartItems.update(items => {
      return items.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  }

  // Vaciar por completo el carrito
  clearCart(): void {
    this.cartItems.set([]);
    this.showNotification('Carrito de compras vaciado.');
  }

  // Simulador del proceso de pago (Checkout)
  checkout(): void {
    if (this.cartItems().length === 0) return;
    this.showNotification(`¡Pago realizado con éxito! Pedido enviado a ${this.API_URL}/orders`);
    this.cartItems.set([]);
  }

  // Auxiliar para mostrar notificaciones flotantes (Toast)
  private showNotification(msg: string): void {
    this.notificationMessage.set(msg);
    setTimeout(() => {
      this.notificationMessage.set(null);
    }, 3000);
  }
}