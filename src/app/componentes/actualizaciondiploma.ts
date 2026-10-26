import { Component, input, signal, effect, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

// Importaciones de tus fuentes e imágenes base64 locales
import { wfont } from './FONTSketch Gothic';
import { fonnt } from './FONTHEIDH';
import { fontzap } from './FONTZapfino-new';
import { fontt } from './FONTZapfino-normal';
import { subdir, wwwdir, logo, logowww } from './logo';
import { isAuth } from './auth';

// Interfaz para la estructura del diploma
export interface DiplomaData {
  title: string;
  institute: string;
  faculty: string;
  scola: string;
  user: string;
  username: string;
  code: string;
  dateb: string;
  datee: string;
  dateget: Date;
  description: string;
  nota: number;
  ip: any;
  units: any[];
  Módulos: number;
  Número: string;
  QR: string;
  type: string;
  signature1: string;
  signature2: string;
  signature3: string;
}

@Component({
  selector: 'app-export-to-pdf',
  standalone: true,
  template: `
    <button 
      (click)="exportPdf()" 
      class="btn btn-outline-primary" 
      style="margin: .1em;" 
      [disabled]="loading()"><i class="bi bi-printer"></i>
      {{ loading() ? 'GENERANDO...' : 'IMPRIMIR DIPLOMA ' + (nota() === 0 ? '' : nota()) }}
    </button>
  `
})
export class ExportToPdfComponent implements OnInit {
  private http = inject(HttpClient);

  // 1. Inputs usando Signals (Angular 17.1+)
  datacurse = input<any>(null);
  user = input<any>(null);
  nota = input<number>(0);

  // 2. Estados locales con Signals
  ip = signal<any>([]);
  qrBase64 = signal<string>('');
  loading = signal<boolean>(false);

  constructor() {
    // 3. Effect equivalente al useEffect([user?._id, datacurse?._id]) de React
    effect(() => {
      const u = this.user();
      const c = this.datacurse();

      if (u?._id && c?._id) {
        const envUrl = this.getEnvVar('REACT_APP_ENV');
        const qrUrl = `${envUrl}:3000/diploma/${u._id}/${c._id}`;

        QRCode.toDataURL(qrUrl, { errorCorrectionLevel: 'H', margin: 2 })
          .then((url) => this.qrBase64.set(url))
          .catch((err) => console.error('Error generando QR:', err));
      }
    });
  }

  // Equivalente al useEffect([]) para obtener IP
  ngOnInit(): void {
    this.http.get('https://ipapi.co/json/').subscribe({
      next: (data) => this.ip.set(data),
      error: (err) => console.error('Error fetching IP location:', err)
    });
  }

  // Helper para leer variables de entorno en Angular sin causar errores de compilación
  private getEnvVar(key: string): string {
    const globalEnv = (window as any)?.env || (typeof process !== 'undefined' ? process.env : {});
    return globalEnv?.[key] || '';
  }

  // Construcción dinámica de los datos del diploma
  private getDiplomaData(): DiplomaData {
    const curse = this.datacurse();
    const currentUser = this.user();
    const auth = isAuth() || {};

    const envAppUrl = this.getEnvVar('REACT_APP_ENV');
    const envInstitute = this.getEnvVar('REACT_APP_institute');
    const envPage = this.getEnvVar('REACT_APP_page');

    return {
      title: curse?.title || '',
      institute: envInstitute,
      faculty: envPage,
      scola: envInstitute,
      user: auth._id || '',
      username: auth.name || '',
      code: curse?._id || '',
      dateb: curse?.updatedAt || new Date().toISOString(),
      datee: curse?.updatedAt || new Date().toISOString(),
      dateget: new Date(),
      description: 'wwwww',
      nota: this.nota(),
      ip: this.ip(),
      units: curse?.units || [],
      Módulos: this.nota(),
      Número: '',
      QR: `${envAppUrl}:3000/diploma/${currentUser?._id}/${curse?._id}`,
      type: 'DIPLOMADO',
      signature1: 'TAIPE CARBAJAL, Marcelino Efrain',
      signature2: 'TAIPE CARBAJAL, Marcelino Efrain',
      signature3: 'TAIPE CARBAJAL, Marcelino Efrain'
    };
  }

  private sendTest(diplomaData: DiplomaData): void {
    const apiUrl = this.getEnvVar('REACT_APP_API_URL');
    this.http.post(`${apiUrl}/tasks/test/diploma`, diplomaData).subscribe({
      error: (error) => console.error('ERROR enviando diploma:', error)
    });
  }

  // Lógica principal de generación de PDF
  async exportPdf(): Promise<void> {
    const curse = this.datacurse();
    console.log(curse)
    if (!curse) return;

    this.loading.set(true);

    try {
      const diplomaData = this.getDiplomaData();

      const neww: any[] = [];
      const units = curse.units || [];

      units.forEach((unit: any) => {
        const formattedDate = unit.createdAt
          ? format(parseISO(unit.createdAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
          : '';
        
        neww.push([
          {
            content: `${(unit.title || '').toUpperCase()} ${formattedDate}`,
            colSpan: 3,
            styles: { halign: 'center', font: 'courier', fillColor: [240, 240, 150] }
          }
        ]);

        const themes = unit.themes || [];
        themes.forEach((theme: any) => {
          neww.push([
            theme.title,
            theme.idtheme,
            unit.createdAt ? format(parseISO(unit.createdAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es }) : ''
          ]);
        });
      });

      const doc = new jsPDF({ unit: 'cm', orientation: 'landscape', format: [32, 21] });

      // Carga de Fuentes en VFS
      doc.addFileToVFS('Sketch Gothic School-normal.ttf', wfont);
      doc.addFont('Sketch Gothic School-normal.ttf', 'Sketch Gothic School', 'normal');
      doc.addFileToVFS('HEIDH___-normal.ttf', fonnt);
      doc.addFont('HEIDH___-normal.ttf', 'HEIDH___', 'normal');
      doc.addFileToVFS('Zapfino.ttf', fontt);
      doc.addFont('Zapfino.ttf', 'Zapfino', 'normal');
      doc.addFileToVFS('zapfino-extra-lt-two_vq9Lj-normal.ttf', fontzap);
      doc.addFont('zapfino-extra-lt-two_vq9Lj-normal.ttf', 'zapfino-extra-lt-two_vq9Lj', 'normal');

      const opacityState = new (doc as any).GState({ opacity: 0.8 });
      doc.setGState(opacityState);

      // Transformaciones matriciales
      (doc as any).advancedAPI(() => {
        doc.saveGraphicsState();
        const { a, b, c, d, e, f } = new DOMMatrix()
          .translate(-1, doc.internal.pageSize.height / 2)
          .rotate(-45);

        (doc as any).setCurrentTransformationMatrix((doc as any).Matrix(a, b, c, d, e, f));
        for (let i = 1; i < 11; i++) {
          doc.setLineWidth(0.5 - (0.5 - 0.01) / i);
          doc.setDrawColor(35, 35, 15 * (5 * i));
          doc.setFillColor(155, 155, 155);
          doc.roundedRect(-9 + i, -1 + i, 36 - 2 * i, 23 - 2 * i, 2, 2, 'S');
        }
        doc.fill();
        doc.restoreGraphicsState();
      });

      doc.setLineWidth(0.03);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(255, 255, 255);
      doc.roundedRect(0.5, 0.5, doc.internal.pageSize.width - 1, doc.internal.pageSize.height - 1, .2, .2, 'S');
      doc.setDrawColor('#0000FF');
      doc.roundedRect(1, 1, doc.internal.pageSize.width - 2, doc.internal.pageSize.height - 2, .2, .2, 'FD');

      const widthh = doc.internal.pageSize.width;
      const heightt = doc.internal.pageSize.height;

      // Encabezado
      doc.setFont('Sketch Gothic School');
      let ytag = 2.6;
      doc.setFontSize(23);
      let splittedText = doc.splitTextToSize(diplomaData.institute, (3 * widthh) / 5);
      let lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
      let blockHeight = splittedText.length * lineHeight;
      doc.text(splittedText, widthh / 2, ytag, { maxWidth: (3 * widthh) / 5, align: 'center' });
      ytag += blockHeight + 0.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(15);
      splittedText = doc.splitTextToSize('OTORGA EL PRESENTE DIPLOMA A', (2 * widthh) / 3);
      lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
      blockHeight = splittedText.length * lineHeight;
      doc.text(splittedText, widthh / 2, ytag, { maxWidth: (2 * widthh) / 3, align: 'center' });
      ytag += blockHeight + 1.6;

      doc.setFont('Sketch Gothic School');
      doc.setFontSize(38);
      splittedText = doc.splitTextToSize(diplomaData.username, (3 * widthh) / 2);
      lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
      blockHeight = splittedText.length * lineHeight;
      doc.text(splittedText, widthh / 2, ytag, { maxWidth: (3 * widthh) / 2, align: 'center' });
      ytag += blockHeight + 0.1;

      // Cuerpo
      doc.setFont('helvetica', 'normal');
      const dateBFormatted = diplomaData.dateb ? format(parseISO(diplomaData.dateb), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es }) : '';
      const dateEFormatted = diplomaData.datee ? format(parseISO(diplomaData.datee), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es }) : '';

      const wzw = `Por haber cumplido y aprobado satisfactoriamente los requisitos académicos del DIPLOMADO EN ${diplomaData.title.toUpperCase()}. Desarrollado del ${dateBFormatted} al ${dateEFormatted}, con una intensidad horaria de ${this.nota()} horas. Dado en Huamanga Ayacucho, el ${format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}`;

      doc.setFontSize(14);
      doc.text(wzw, widthh / 19, ytag, { maxWidth: (17 * widthh) / 19, align: 'justify' });
      splittedText = doc.splitTextToSize(wzw, (17 * widthh) / 19);
      lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
      blockHeight = splittedText.length * lineHeight;
      ytag += blockHeight + 0.5;

      doc.text(format(diplomaData.dateget, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es }), widthh - 1.7, ytag, { align: 'right' });

      doc.setFont('courier', 'normal');
      ytag += 1;
      doc.text(`ID del curso ${diplomaData.code}`, widthh - 1.7, ytag, { align: 'right' });
      ytag += 1;
      doc.text(`ID del usuario ${diplomaData.user}`, widthh - 1.7, ytag, { align: 'right' });
      ytag += 1;

      doc.setFont('Zapfino');
      const envPage = this.getEnvVar('REACT_APP_page');
      doc.text(envPage || '', widthh / 19, ytag, { maxWidth: (17 * widthh) / 19, align: 'justify' });

      // Logos e imágenes Base64
      doc.setFont('courier', 'normal');
      doc.addImage('data:image/jpeg;base64,' + logo, 'jpeg', 2, 1.5, 3.7, 3.5, '', 'NONE');
      doc.addImage('data:image/jpeg;base64,' + logowww, 'jpeg', widthh - 5.5, 1.5, 3.5, 3.5, '', 'NONE');

      doc.addImage('data:image/jpeg;base64,' + wwwdir, 'jpeg', 1.5, 15.2, 8, 3.2, '', 'NONE');
      doc.addImage('data:image/jpeg;base64,' + subdir, 'jpeg', 12.5, 15.2, 8.3, 3.3, '', 'NONE', -1);
      doc.addImage('data:image/jpeg;base64,' + wwwdir, 'png', 22.5, 15.2, 8, 3.2, '', 'NONE', 1);

      // Firmas
      doc.text(diplomaData.signature1, (1.2 * widthh) / 6, (14.5 * heightt) / 16, { maxWidth: (2 * widthh) / 6, align: 'center' });
      doc.text(diplomaData.signature2, (3 * widthh) / 6, (14.5 * heightt) / 16, { maxWidth: (2 * widthh) / 6, align: 'center' });
      doc.text(diplomaData.signature3, (4.8 * widthh) / 6, (14.5 * heightt) / 16, { maxWidth: (2 * widthh) / 6, align: 'center' });

      doc.setTextColor(1, 1, 1);

      // --- PAGINA 2 ---
      doc.addPage();

      (doc as any).advancedAPI(() => {
        doc.saveGraphicsState();
        const { a, b, c, d, e, f } = new DOMMatrix()
          .translate(-1, doc.internal.pageSize.height / 2)
          .rotate(-45);

        (doc as any).setCurrentTransformationMatrix((doc as any).Matrix(a, b, c, d, e, f));
        for (let i = 1; i < 11; i++) {
          doc.setLineWidth(0.5 - (0.5 - 0.01) / i);
          doc.setDrawColor(35, 35, 15 * (5 * i));
          doc.roundedRect(-9 + i, -1 + i, 36 - 2 * i, 23 - 2 * i, 2, 2, 'S');
        }
        doc.fill();
        doc.restoreGraphicsState();
      });

      doc.setLineWidth(0.03);
      doc.setFillColor(255, 255, 255);
      doc.saveGraphicsState();
      doc.setGState(opacityState);

      doc.setDrawColor(55, 55, 255);
      doc.roundedRect(0.5, 0.5, doc.internal.pageSize.width - 1, doc.internal.pageSize.height - 1, 1, 1, 'S');
      doc.setDrawColor('#2d34bdff');
      doc.roundedRect(1, 1, doc.internal.pageSize.width - 2, doc.internal.pageSize.height - 2, 1, 1, 'FD');

      doc.restoreGraphicsState();

      doc.setFont('courier');
      doc.setTextColor('#0f0b38ff');
      doc.setFontSize(9);

      const qr = this.qrBase64();
      if (qr) {
        doc.addImage('data:image/jpeg;base64,' + qr.split(',')[1], 'png', 26.9, 15.9, 3, 3, '', 'NONE');
      }

      doc.text(diplomaData.institute, 6.2, 18.9, { maxWidth: (1.5 * widthh) / 5, align: 'center' });
      doc.text(diplomaData.code, (3 * widthh) / 6, (14.7 * heightt) / 16, { maxWidth: (2 * widthh) / 6, align: 'center' });
      doc.text('Obtener diploma', (5.45 * widthh) / 6, (14.7 * heightt) / 16, { maxWidth: (1 * widthh) / 5, align: 'center' });
      doc.text(`${diplomaData.QR}`, (3 * widthh) / 6, (15 * heightt) / 16, { maxWidth: (4 * widthh) / 5, align: 'center' });

      doc.save('downloaded-pdf-with-image.pdf');

      this.sendTest(diplomaData);
    } catch (err) {
      console.error('Error generando el PDF:', err);
    } finally {
      this.loading.set(false);
    }
  }
}