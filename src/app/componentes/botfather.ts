import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-bot-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Historial de interacciones del Bot de Telegram</h2>
      <ul>
        <li *ngFor="let log of logs">
          <strong>&#64;{{ log.username || 'Anónimo' }}</strong>: {{ log.message }} 
          <small>({{ log.date | date:'short' }})</small>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    small {
      color: #666;
      margin-left: 10px;
    }
  `]
})
export class BotDashboardComponent implements OnInit {
  logs: any[] = [];

  // URL y cliente HTTP integrados directamente en el componente
  //'http://localhost:3000/api/bot-logs'
  private apiUrl = environment.apiURL || process.env['REACT_APP_API_URL'] || '';
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/ bot-logs`).subscribe({
      next: (data) => this.logs = data,
      error: (err) => console.error('Error cargando logs', err)
    });
  }
}