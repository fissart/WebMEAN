import { Component, input } from '@angular/core';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logo, logoperu } from './logo';

@Component({
  selector: 'export-to-excel',
  standalone: true,
  template: `
    <button (click)="exportExcel()" class="btn btn-primary" style="margin: .1em">
      <i class="bi bi-camera"></i> Registro en excel [{{ year() }} {{ mencion() }} {{ ciclo() }} {{ curse() }} {{credito()}}]
    </button>
  `
})
export class ExportToExcelComponentNotas {
  // Entradas con Signals (Recomendado para Angular moderno)
  data = input<any[]>([]);
  year = input<any>();
  ciclo = input<any>();
  mencion = input<string>();
  curse = input<string>();
  credito = input<any>();

  // Logo en base64 simulado / importado (debes asegurarte de tener tu archivo logo.ts)
  // export const logo = "data:image/jpeg;base64,...";
  // logo = logoContent; 

  // Simulación de autenticación (reemplaza con tu servicio real de auth)
  private isAuth() {
    // Ejemplo: return JSON.parse(localStorage.getItem('user') || '{"name": "SIN ASIGNAR"}');
    return { name: "DOCENTE EJEMPLO" }; 
  }

  async exportExcel() {
    const dataList = this.data();
    const yearVal = this.year();
    const cicloVal = this.ciclo();
    const mencionVal = this.mencion();
    const curseVal = this.curse();
    const creditoVal = this.credito();

    console.log(dataList, yearVal, cicloVal, mencionVal, curseVal, creditoVal);

    const authUser = this.isAuth();
    const nombreDocente = authUser && authUser.name ? authUser.name : "SIN ASIGNAR";

    const carrera = mencionVal === "ED" ? "EDUCACIÓN ARTÍSTICA" : "ARTISTA PROFESIONAL";

    const especialidades: Record<string, string> = {
      "ED": "ARTES PLÁSTICAS",
      "P": "ARTES PLÁSTICAS Y VISUALES (PINTURA)",
      "E": "ARTES PLÁSTICAS Y VISUALES (ESCULTURA)"
    };
    const especialidad = especialidades[mencionVal || ''] || "ARTES PLÁSTICAS Y VISUALES (GRABADO)";

    const newNotes = dataList;

    // Diccionarios Estáticos para Reemplazo de Caracteres Masivos
    const mapLicencia = ['L', 'I', 'C', 'E', 'N', 'C', 'I', 'A', '', '', '', '', '', '', '', '', '', '', ''];
    const mapRetirado = ['R', 'E', 'T', 'I', 'R', 'A', 'D', 'O', '', '', '', '', '', '', '', '', '', '', ''];
    const wWww = ['P', 'F', 'T'];
    const wWwww_correct = ['P', 'J', 'F', 'T'];

    // Procesamiento de datos base (O(N))
    const slag = newNotes.map((note, index) => {
      const w_1 = note.notta || [];
      const wsum = w_1.length > 0 ? w_1[0].nota : 0;
      const fila = [index + 1, note.name, ...Array(16).fill(undefined)];
      fila.push(String(wsum) === "-0" ? "L" : wsum === "0" || wsum === 0 ? "R" : Number(wsum));
      return fila;
    });

    const generarFilaDeNotas = (index: number, notaObjeto: any) => {
      const w_1 = notaObjeto?.notta || [];
      const wsum = w_1.length > 0 ? w_1[0].nota : 0;
      const stringNota = String(wsum);
      const fila: any[] = [index + 1];

      for (let col = 0; col < 18; col++) {
        if (stringNota === '-0') {
          fila.push(mapLicencia[col]);
        } else if (wsum === 0) {
          fila.push(mapRetirado[col]);
        } else if (wsum > 1 && wsum <= 11) {
          fila.push(wWww[Math.floor(Math.random() * wWww.length)]);
        } else if (wsum > 11 && wsum <= 14) {
          fila.push(wWwww_correct[Math.floor(Math.random() * wWwww_correct.length)]);
        } else {
          fila.push("P");
        }
      }
      return fila;
    };

    const notas: any[] = [];
    const notass: any[] = [];
    const nstudent = Math.min(newNotes.length, 35);

    for (let i = 0; i < nstudent; i++) notas.push(generarFilaDeNotas(i, newNotes[i]));
    for (let i = 35; i < newNotes.length; i++) notass.push(generarFilaDeNotas(i, newNotes[i]));

    const date = new Date();
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
    const time = `${date.getDate()}-${meses[date.getMonth()]}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    const workbook = new ExcelJS.Workbook();

    // ==========================================
    // HOJA 1 - ASISTENCIA
    // ==========================================
    const wworksheet = workbook.addWorksheet('1', { pageSetup: { paperSize: 9, orientation: 'landscape' } });
    wworksheet.pageSetup.margins = { left: 0.35, right: 0.35, top: 0.38, bottom: 0.38, header: 0.01, footer: 0.01 };
    wworksheet.pageSetup.printArea = 'A1:AP100';
    wworksheet.pageSetup.printTitlesRow = '1:3';
    wworksheet.pageSetup.printTitlesColumn = 'AL:AO';

    wworksheet.mergeCells('A1:AL1');
    wworksheet.mergeCells('AK2:AL2');

    for (let col = 1; col <= 36; col++) {
      const colLetter = col <= 26 ? String.fromCharCode(64 + col) : 'A' + String.fromCharCode(64 + (col - 26));
      wworksheet.mergeCells(`${colLetter}2:${colLetter}3`);
    }

    wworksheet.getCell('A1').value = "ASISTENCIA";
    wworksheet.getCell('AK2').value = "TEMARIO";
    wworksheet.getCell('AK3').value = "FECHA";
    wworksheet.getCell('AL3').value = "CONTENIDO";

    notas.forEach(d => wworksheet.addRow(d));

    const bloquesSupervision = [
      { title: 'A39', cells: ['A40', 'J40', 'S40', 'AB40'], ranges: ['A39:AJ39', 'A40:I43', 'J40:R43', 'S40:AA43', 'AB40:AJ43', 'A44:I52', 'J44:R52', 'S44:AA52', 'AB44:AJ52'] },
      { title: 'A87', cells: ['A88', 'J88', 'S88', 'AB88'], ranges: ['A87:AJ87', 'A88:I91', 'J88:R91', 'S88:AA91', 'AB88:AJ91', 'A92:I100', 'J92:R100', 'S92:AA100', 'AB92:AJ100'] }
    ];

    bloquesSupervision.forEach(b => {
      b.ranges.forEach(range => wworksheet.mergeCells(range));
      wworksheet.getCell(b.title).value = "SUPERVISIONES";
      wworksheet.getCell(b.cells[0]).value = "FECHA Y FIRMA";
      wworksheet.getCell(b.cells[1]).value = "OBSERVACIÓN Y RECOMENDACIÓN";
      wworksheet.getCell(b.cells[2]).value = "FECHA Y FIRMA";
      wworksheet.getCell(b.cells[3]).value = "OBSERVACIÓN Y RECOMENDACIÓN";
    });

    notass.forEach(d => wworksheet.addRow(d));

    const textoAnio = ['1', '2'].includes(cicloVal) ? "PRIMER AÑO" : ['3', '4'].includes(cicloVal) ? "SEGUNDO AÑO" : ['5', '6'].includes(cicloVal) ? "TERCER AÑO" : ['7', '8'].includes(cicloVal) ? "CUARTO AÑO" : "QUINTO AÑO";

    wworksheet.getCell(`AM1`).value = 'ESCUELA SUPERIOR DE FORMACIÓN ARTÍSTICA AYACUCHO\n "FELIPE GUAMÁN POMA DE AYALA"';
    wworksheet.mergeCells(`AM1:AO2`);
    wworksheet.getCell(`AM3`).value = "CON NIVEL UNIVERSITARIO";
    wworksheet.mergeCells(`AM3:AO3`);

    const mapeoMetadatos = (startRow: number, offsetLey: number) => {
      wworksheet.getCell(`AM${startRow + 3}`).value = "LEY N 29696, DE INCORPORACIÓN A LA LEY UNIVERSITARIA";
      wworksheet.mergeCells(`AM${startRow + 3}:AO${startRow + 4}`);
      wworksheet.getCell(`AM${startRow + 5}`).value = "LEY N 30220, LEY UNIVERSITARIA";
      wworksheet.mergeCells(`AM${startRow + 5}:AO${startRow + 5}`);

      wworksheet.getCell(`AM${startRow + offsetLey}`).value = "REGISTRO DE EVALUACIÓN";
      wworksheet.mergeCells(`AM${startRow + offsetLey}:AO${startRow + offsetLey + 1}`);

      const configCampos = [
        { label: "REGIÓN", val: ": AYACUCHO", r: offsetLey + 3 },
        { label: "PROVINCIA", val: ": HUAMANGA", r: offsetLey + 5 },
        { label: "DISTRITO", val: ": JESÚS NAZARENO", r: offsetLey + 7 },
        { label: "CARRERA PROFESIONAL", val: carrera, r: offsetLey + 9, merge: true },
        { label: "ESPECIALIDAD", val: especialidad, r: offsetLey + 12, merge: true },
        { label: "ASIGNATURA", val: curseVal ? curseVal.toUpperCase() : '', r: offsetLey + 15, merge: true },
        { label: "SEMESTRE:", val: cicloVal, r: offsetLey + 18 },
        { label: "TURNO:", val: "MAÑANA", r: offsetLey + 20 },
        { label: "AÑO:", val: textoAnio, r: offsetLey + 22 },
        { label: "DOCENTE:", val: nombreDocente, r: offsetLey + 24 }
      ];

      configCampos.forEach(c => {
        wworksheet.getCell(`AM${startRow + c.r}`).value = c.label;
        if (c.merge) {
          wworksheet.getCell(`AM${startRow + c.r + 1}`).value = c.val;
          wworksheet.mergeCells(`AM${startRow + c.r}:AO${startRow + c.r}`);
          wworksheet.mergeCells(`AM${startRow + c.r + 1}:AO${startRow + c.r + 1}`);
        } else {
          wworksheet.getCell(`AN${startRow + c.r}`).value = c.val;
          wworksheet.mergeCells(`AN${startRow + c.r}:AO${startRow + c.r}`);
        }
      });

      wworksheet.getCell(`AM${startRow + offsetLey + 27}`).value = time.toUpperCase();
      wworksheet.mergeCells(`AM${startRow + offsetLey + 27}:AO${startRow + offsetLey + 28}`);
    };

    mapeoMetadatos(1, 23);
    mapeoMetadatos(50, 22);


    // Nota: Si importas un logo válido en base64, descomenta las líneas de abajo:
    wworksheet.addImage(workbook.addImage({ base64: logo, extension: 'jpeg' }), { tl: { col: 38.8, row: 8 }, ext: { width: 185, height: 185 }, editAs: 'absolute' });
    wworksheet.addImage(workbook.addImage({ base64: logo, extension: 'jpeg' }), { tl: { col: 38.8, row: 56 }, ext: { width: 185, height: 185 }, editAs: 'absolute' });

    const bordeMedio: any = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };

    ['AK2', 'AK3', 'A1', 'AL3', 'A2'].forEach(key => {
      const cell = wworksheet.getCell(key);
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { name: 'arial', size: 8, bold: true };
      cell.border = bordeMedio;
    });

    wworksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 };

    const fechaSemestre = new Date(`${['1', '3', '5', '7', '9'].includes(cicloVal) ? 'March 17' : 'August 17'}, ${yearVal} 03:24:00`);
    wworksheet.getCell('B2').value = fechaSemestre;
    wworksheet.getCell('AK4').value = fechaSemestre;
    wworksheet.getCell('AK53').value = fechaSemestre;

    const columnasFechas = ['B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2', 'K2', 'L2', 'M2', 'N2', 'O2', 'P2', 'Q2', 'R2', 'S2', 'T2', 'U2', 'V2', 'W2', 'X2', 'Y2', 'Z2', 'AA2', 'AB2', 'AC2', 'AD2', 'AE2', 'AF2', 'AG2', 'AH2', 'AI2', 'AJ2', 'AK4'];

    columnasFechas.forEach((key, index) => {
      const cell = wworksheet.getCell(key);
      cell.font = { color: { argb: '0a090a' }, name: 'arial', size: 7 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 };
      cell.border = bordeMedio;
      cell.numFmt = 'dd/mm/yyyy';

      if (index > 0 && index < 18) {
        wworksheet.getCell(columnasFechas[index]).value = { formula: `=B2+7*${index}`, date1904: true };
      }
    });

    for (let x = 4; x <= 100; x++) {
      wworksheet.getRow(x).height = 10.1;
      for (let col = 1; col <= 41; col++) {
        const colLetter = col <= 26 ? String.fromCharCode(64 + col) : 'A' + String.fromCharCode(64 + (col - 26));
        const cell = wworksheet.getCell(`${colLetter}${x}`);
        cell.border = col <= 38 ? bordeMedio : null;
        cell.font = { name: 'arial', size: 8 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }
      wworksheet.getCell(`A${x}`).font = { name: 'arial', size: 8, bold: true };
    }

    ['AM34', 'AM37', 'AM40', 'AM82', 'AM85', 'AM88'].forEach(key => wworksheet.getCell(key).font = { color: { argb: '3a80d5' }, name: 'arial', size: 8, bold: true });
    ['AM24', 'AM73'].forEach(key => wworksheet.getCell(key).font = { name: 'arial', size: 12, bold: true });

    const filasDerecha = [27, 29, 31, 42, 44, 46, 48, 75, 77, 79, 90, 92, 94, 96];
    filasDerecha.forEach(f => {
      wworksheet.getCell(`AM${f}`).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
      wworksheet.getCell(`AN${f}`).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    });
    wworksheet.getCell('AN96').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    wworksheet.getCell('AN1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    wworksheet.getCell('AN3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    wworksheet.getCell('AN1').border = { top: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
    wworksheet.getCell('AN51').border = { bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
    wworksheet.getCell('AN99').border = { bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };

    for (let x = 3; x <= 50; x++) wworksheet.getCell(`AO${x}`).border = { right: { style: 'medium' } };
    for (let x = 53; x <= 98; x++) wworksheet.getCell(`AO${x}`).border = { right: { style: 'medium' } };

    const aplicarIncrementosTemario = (start: number, end: number) => {
      for (let x = start; x <= end; x++) {
        const cell = wworksheet.getCell(`AK${x + 1}`);
        cell.value = { formula: `=AK${x}+7`, date1904: true };
        cell.numFmt = 'dd/mm/yyyy';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'arial', size: 7, color: { argb: '0a090a' } };
      }
    };
    aplicarIncrementosTemario(4, 21);
    aplicarIncrementosTemario(53, 70);

    wworksheet.getColumn(1).width = 2.1;
    for (let x = 2; x <= 36; x++) wworksheet.getColumn(x).width = 2;
    wworksheet.getColumn(37).width = 9;
    wworksheet.getColumn(38).width = 28.5;
    wworksheet.getColumn(39).width = 10.1;
    wworksheet.getColumn(40).width = 18.3;
    wworksheet.getColumn(41).width = 10.1;

    wworksheet.getRow(1).height = 19;
    wworksheet.getRow(2).height = 23;
    wworksheet.getRow(3).height = 23;
    wworksheet.getRow(36).height = 10.5;

    // ==========================================
    // HOJA 2 - EVALUACIONES
    // ==========================================
    const worksheet = workbook.addWorksheet('2', { pageSetup: { paperSize: 9, orientation: 'landscape' } });
    worksheet.pageSetup.margins = { left: 0.38, right: 0.38, top: 0.38, bottom: 0.38, header: 0.01, footer: 0.01 };
    worksheet.pageSetup.printArea = 'A1:Y74';
    worksheet.pageSetup.printTitlesRow = '1:4';

    const cabecerasMetadatos = [
      { cell: 'B1', val: `CARRERA PROFESIONAL\n${carrera}` },
      { cell: 'B2', val: `SUB AREA - ASIGNATURA\n${curseVal ? curseVal.toUpperCase() : ''}` },
      { cell: 'B3', val: `CICLO\n${cicloVal}` },
      { cell: 'B4', val: "APELLIDOS Y NOMBRES" }
    ];
    cabecerasMetadatos.forEach(c => worksheet.getCell(c.cell).value = c.val);

    worksheet.mergeCells('A1:A4');
    worksheet.mergeCells('C1:N1');
    worksheet.mergeCells('C2:F2');
    worksheet.mergeCells('G2:J2');
    worksheet.mergeCells('K2:N2');
    worksheet.mergeCells('O1:U2');
    worksheet.mergeCells('V1:Y4');

    for (let col = 3; col <= 21; col++) {
      const colLetter = String.fromCharCode(64 + col);
      worksheet.mergeCells(`${colLetter}3:${colLetter}4`);
    }

    const textosCabecera: Record<string, string> = {
      A1: "ORDEN", C1: "EVALUACIÓN PARCIAL", C2: "UNIDAD 1", G2: "UNIDAD 2", K2: "UNIDAD 3",
      O1: "RESUMEN DE UNIDADES FORMATIVAS", V1: "OBSERVACIONES",
      C3: "CONCEPTUAL", D3: "PROCEDIMENTAL", E3: "ACTITUDINAL", F3: "PROMEDIO",
      G3: "CONCEPTUAL", H3: "PROCEDIMENTAL", I3: "ACTITUDINAL", J3: "PROMEDIO",
      K3: "CONCEPTUAL", L3: "PROCEDIMENTAL", M3: "ACTITUDINAL", N3: "PROMEDIO",
      O3: "ORDEN", P3: "UNIDAD 1", Q3: "UNIDAD 2", R3: "UNIDAD 3", S3: "PROMEDIO", T3: "CRÉDITO", U3: "PUNTAJE"
    };
    Object.entries(textosCabecera).forEach(([key, val]) => worksheet.getCell(key).value = val);

    const celdasCabecera6pt = ['B1', 'C1', 'V1', 'O1', 'C2', 'G2', 'K2', 'B3', 'B4', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3', 'M3', 'N3', 'P3', 'Q3', 'R3', 'S3', 'T3', 'U3'];
    const celdasCabecera8pt = ['A1', 'F3', 'J3', 'N3', 'S3', 'T3', 'U3', 'O3', 'C1', 'C2', 'G2', 'K2', 'O1', 'V1'];

    celdasCabecera6pt.forEach(key => {
      const cell = worksheet.getCell(key);
      cell.alignment = { vertical: 'middle', horizontal: 'center', textRotation: 90 };
      cell.font = { name: 'arial', size: 6, bold: true };
      cell.border = bordeMedio;
    });

    celdasCabecera8pt.forEach(key => {
      const cell = worksheet.getCell(key);
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      if (['A1', 'F3', 'J3', 'N3', 'S3', 'T3', 'U3', 'O3'].includes(key)) cell.alignment.textRotation = 90;
      cell.font = { name: 'arial', size: 8, bold: true };
      cell.border = bordeMedio;
    });

    for (let x = 1; x <= 4; x++) {
      worksheet.getRow(x).height = 30.5;
      worksheet.getCell(`B${x}`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getCell(`B${x}`).font = { name: 'arial', size: 8, bold: true };
    }

    slag.forEach(d => worksheet.addRow(d));

    const añadirReglaFormato = (ref: string, formula: string, color: string) => {
      worksheet.addConditionalFormatting({
        ref: `${ref}${newNotes.length + 4}`,
        rules: [{ priority: 1, type: 'expression', formulae: [formula], style: { font: { color: { argb: color } } } }]
      });
    };

    añadirReglaFormato('C5:N', 'C5<=10', 'fc0303');
    añadirReglaFormato('C5:N', 'ISTEXT(C5)', 'C46B11');
    añadirReglaFormato('P5:S', 'P5<=10', 'fc0303');
    añadirReglaFormato('P5:S', 'ISTEXT(P5)', 'C46B11');
    añadirReglaFormato('U5:U', 'ISTEXT(U5)', 'C46B11');

    const esMenorOIgual35 = newNotes.length <= 35;
    const rStart = esMenorOIgual35 ? 32 : 67;

    worksheet.getCell(`V${rStart}`).value = "RESUMEN";
    worksheet.getCell(`V${rStart}`).font = { name: 'arial', size: 8, bold: true };
    worksheet.getCell(`V${rStart + 7}`).value = `JESÚS NAZARENO ${time.toUpperCase()}`;

    const camposResumen = [
      { label: "Aprobados:", formula: `COUNTIF($S$5:$S$${newNotes.length + 4},">=11")`, row: rStart + 1 },
      { label: "Desaprobados:", formula: `COUNTIF($S$5:$S$${newNotes.length + 4},"<11")`, row: rStart + 2 },
      { label: "Retirados:", formula: `COUNTIF($S$5:$S$${newNotes.length + 4},"=R")`, row: rStart + 3 },
      { label: "Licencia:", formula: `COUNTIF($S$5:$S$${newNotes.length + 4},"=L")`, row: rStart + 4 },
      { label: "TOTAL:", val: newNotes.length, row: rStart + 5 }
    ];

    const filasSetResumen = camposResumen.map(c => c.row);

    camposResumen.forEach(c => {
      worksheet.getCell(`V${c.row}`).value = c.label;
      worksheet.getCell(`Y${c.row}`).value = c.formula ? { formula: c.formula, date1904: true } : c.val;
    });

    for (let x = 5; x <= 74; x++) {
      if (filasSetResumen.includes(x)) {
        worksheet.mergeCells(`V${x}:X${x}`);
        worksheet.getCell(`V${x}`).alignment = { vertical: 'middle', horizontal: 'right' };
        worksheet.getCell(`Y${x}`).alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell(`V${x}`).border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' } };
        worksheet.getCell(`Y${x}`).border = { top: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      } else {
        worksheet.getCell(`V${x}`).border = { top: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        worksheet.mergeCells(`V${x}:Y${x}`);
      }
    }
    worksheet.getCell(`V${rStart}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell(`V${rStart + 7}`).alignment = { vertical: 'middle', horizontal: 'center' };

    const opcionesNotaAleatoria = [-1, 0, 1];

    for (let x = 5; x <= 74; x++) {
      worksheet.getRow(x).height = 12.8;
      worksheet.getRow(x).font = { name: 'arial', size: 8 };

      worksheet.getCell(`A${x}`).value = x - 4;
      worksheet.getCell(`O${x}`).value = x - 4;
      worksheet.getCell(`A${x}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(`A${x}`).font = { name: 'arial', size: 8, bold: true };
      worksheet.getCell(`O${x}`).font = { name: 'arial', size: 8, bold: true };

      for (let col = 1; col <= 21; col++) {
        const colLetter = String.fromCharCode(64 + col);
        const cell = worksheet.getCell(`${colLetter}${x}`);
        cell.border = bordeMedio;
        cell.numFmt = '00';
        if (col >= 3) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      if (x <= newNotes.length + 4) {
        worksheet.getCell(`Z${x}`).value = opcionesNotaAleatoria[Math.floor(Math.random() * opcionesNotaAleatoria.length)];
        worksheet.getCell(`W${x}`).font = { color: { argb: '00000' }, name: 'arial', size: 8 };

        worksheet.getCell(`T${x}`).value = { formula: creditoVal, date1904: true };
        worksheet.getCell(`P${x}`).value = { formula: `=IF(S${x}="R","R",IF(S${x}="L","L",IF(AND(S${x}>18,S${x}<=20),S${x},S${x}-Z${x})))`, date1904: true };
        worksheet.getCell(`Q${x}`).value = { formula: `=IF(S${x}="R","R",IF(S${x}="L","L",IF(AND(S${x}>18,S${x}<=20),S${x},S${x}+Z${x})))`, date1904: true };
        worksheet.getCell(`F${x}`).value = { formula: `=IF(P${x}="R","I",IF(P${x}="L","E",P${x}))`, date1904: true };
        worksheet.getCell(`J${x}`).value = { formula: `=IF(Q${x}="R","O",IF(Q${x}="L","A",Q${x}))`, date1904: true };
        worksheet.getCell(`U${x}`).value = { formula: `=IF(S${x}="R","",IF(S${x}="L","",S${x}*T${x}))`, date1904: true };

        worksheet.getCell(`C${x}`).value = { formula: `=IF(P${x}="R","R",IF(P${x}="L","L",IF(AND(P${x}>18,P${x}<=20),P${x},P${x}-Z${x})))`, date1904: true };
        worksheet.getCell(`D${x}`).value = { formula: `=IF(P${x}="R","E",IF(P${x}="L","I",IF(AND(P${x}>18,P${x}<=20),P${x},P${x})))`, date1904: true };
        worksheet.getCell(`E${x}`).value = { formula: `=IF(P${x}="R","T",IF(P${x}="L","C",IF(AND(P${x}>18,P${x}<=20),P${x},P${x}+Z${x})))`, date1904: true };
        worksheet.getCell(`G${x}`).value = { formula: `=IF(Q${x}="R","R",IF(Q${x}="L","N",IF(AND(Q${x}>18,Q${x}<=20),Q${x},Q${x}+Z${x})))`, date1904: true };
        worksheet.getCell(`H${x}`).value = { formula: `=IF(Q${x}="R","A",IF(Q${x}="L","C",IF(AND(Q${x}>18,Q${x}<=20),Q${x},Q${x})))`, date1904: true };
        worksheet.getCell(`I${x}`).value = { formula: `=IF(Q${x}="R","D",IF(Q${x}="L","I",IF(AND(Q${x}>18,Q${x}<=20),Q${x},Q${x}-Z${x})))`, date1904: true };
      }
    }

    worksheet.getColumn(1).width = 3.5;
    worksheet.getColumn(2).width = 36;
    for (let x = 3; x <= 21; x++) worksheet.getColumn(x).width = 3.7;

    worksheet.getColumn(23).width = 12.5;
    worksheet.getColumn(25).width = 9.5;
    worksheet.getColumn(26).width = 0.01;

    // ==========================================
    // EXPORTACIÓN Y DESCARGA
    // ==========================================
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${mencionVal} CICLO ${cicloVal} AÑO ${yearVal}.xlsx`);
  }
}
