import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare var Izipay: any;

export interface IzipaySessionResponse {
  transactionId: string;
  merchantCode: string;
  orderNumber: string;
  amount: string;
  currency: string;
  dateTimeTransaction: string;
  authorization: string; // Token de sesión retornado por el backend
  keyRSA: string;        // Llave pública configurada o devuelta por el backend
}

@Injectable({
  providedIn: 'root'
})
export class IzipayService {
  private http = inject(HttpClient);

  createSession(amount: number, orderId: string): Observable<IzipaySessionResponse> {
    return this.http.post<IzipaySessionResponse>(
      `${environment.apiURL}/api/payments/izipay/session`,
      { amount, orderId }
    );
  }

  verifyPayment(paymentResult: any): Observable<any> {
    return this.http.post(
      `${environment.apiURL}/api/payments/izipay/verify`,
      paymentResult
    );
  }
}

@Component({
  selector: 'app-checkout-izipay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card bg-dark text-white border-secondary shadow-lg">
            <div class="card-header border-secondary text-center py-3">
              <h4 class="mb-0 text-warning text-uppercase fw-bold">Resumen de Compra</h4>
            </div>
            
            <div class="card-body p-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-secondary">Producto:</span>
                <span class="fw-bold">Muestra / Catálogo Virtual</span>
              </div>
              <div class="d-flex justify-content-between mb-3 pb-3 border-bottom border-secondary">
                <span class="text-secondary">Moneda:</span>
                <span class="fw-bold">Soles (PEN)</span>
              </div>
              <div class="d-flex justify-content-between fs-5 fw-bold mb-4">
                <span>Total a pagar:</span>
                <span class="text-warning">S/ {{ checkoutAmount().toFixed(2) }}</span>
              </div>

              @if (errorMessage()) {
                <div class="alert alert-danger d-flex align-items-center small" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{{ errorMessage() }}</div>
                </div>
              }

              @if (paymentSuccess()) {
                <div class="alert alert-success text-center" role="alert">
                  <i class="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
                  <h5 class="fw-bold">¡Pago Confirmado!</h5>
                  <p class="mb-0 small">Transacción completada exitosamente.</p>
                </div>
              } @else {
                <button
                  type="button"
                  class="btn btn-warning w-100 py-2 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2"
                  [disabled]="isLoading()"
                  (click)="processCheckout()"
                >
                  @if (isLoading()) {
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Procesando...</span>
                  } @else {
                    <i class="bi bi-credit-card-fill fs-5"></i>
                    <span>Pagar con Izipay / Yape</span>
                  }
                </button>
              }
            </div>

            <div class="card-footer border-secondary text-center py-2">
              <small class="text-secondary">
                <i class="bi bi-shield-lock-fill me-1"></i> Transacción 100% segura
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 8px;
    }
  `]
})
export class CheckoutIzipayComponent implements OnInit {
  private izipayService = inject(IzipayService);

  checkoutAmount = signal<number>(150.00);
  orderId = signal<string>(`ORD${Date.now().toString().slice(-8)}`);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  paymentSuccess = signal<boolean>(false);

  ngOnInit(): void { }

  processCheckout(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.izipayService.createSession(this.checkoutAmount(), this.orderId()).subscribe({
      next: (session: IzipaySessionResponse) => {
        this.isLoading.set(false);
       console.log(session)
        this.openIzipayCheckout(session);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('No se pudo iniciar la pasarela de pago. Inténtelo más tarde.');
        console.error('Error Izipay Session:', err);
      }
    });
  }

  private formatIzipayDate(date: Date = new Date()): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds());
  }

  private openIzipayCheckout(session: IzipaySessionResponse): void {
    if (typeof Izipay === 'undefined') {
      this.errorMessage.set('El SDK de Izipay no está cargado.');
      return;
    }

    const validDateTime = this.formatIzipayDate();

    // 1. Configuración de parámetros de entrada exigidos por el SDK
    const iziConfig = {
      action: 'pay',
      merchantCode: String(session.merchantCode),
      transactionId: String(Date.now()),
      order: {
        orderNumber: String(session.orderNumber),
        currency: 'PEN',
        amount: Number(session.amount).toFixed(2),
        processType: 'AT',
        merchantBuyerId: 'USER-12345',
        dateTimeTransaction: validDateTime
      },
      billing: {
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan.perez@example.com',
        phoneNumber: '989897960',
        street: 'Av Javier Prado 123',
        city: 'Lima',
        state: 'Lima',
        country: 'PE',
        postalCode: '15000',
        documentType: 'DNI',
        document: '12345678'
      },
      render: {
        typeForm: 'pop-up'
      }
    };

    try {
      // 2. Instanciar la clase principal de Izipay
      const checkout = new Izipay({ config: iziConfig });

      // 3. Definir la función que procesará la respuesta al finalizar la transacción
      const callbackResponsePayment = (response: any) => {
        console.log('Respuesta de Izipay:', response);
        if (response && (response.code === '00' || response.message === 'SUCCESS' || response.status === 'SUCCESS')) {
          this.izipayService.verifyPayment(response).subscribe({
            next: () => this.paymentSuccess.set(true),
            error: () => this.errorMessage.set('Error al verificar la transacción en el servidor.')
          });
        } else {
          this.errorMessage.set('La transacción fue rechazada o cancelada.');
        }
      };

      
      // 4. Mostrar el Checkout utilizando obligatoriamente LoadForm con la "L" en mayúscula
      if (checkout && typeof checkout.LoadForm === 'function') {
        checkout.LoadForm({
          authorization: session.authorization, // Token recibido del backend
          keyRSA: session.keyRSA,               // Llave pública de tu comercio
          callbackResponse: callbackResponsePayment
        });
      } else {
        this.errorMessage.set('El método LoadForm no está disponible en el SDK.');
      }
    } catch (error: any) {
      console.error('Error al iniciar el SDK de Izipay:', error);
      this.errorMessage.set('No se pudo inicializar la pasarela de pago.');
    }
  }
}