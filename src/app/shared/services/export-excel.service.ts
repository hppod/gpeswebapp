import { Injectable } from '@angular/core';
import { Workbook } from "exceljs";
import * as fs from 'file-saver';
import { single } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportExcel(excelData) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Dados do Inscritos');

    //Add Row and formating
    worksheet.mergeCells('C1', 'F3');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: "middle", horizontal: "center" }

    // Date
    worksheet.mergeCells('G1:H3');
    let d = new Date();
    let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('G1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
      color: { argb: '0085A3' }
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row 
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    // Adding Data with Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);

      let sales = row.getCell(6);
      let color = 'FF99FF99';
      if (+sales.value < 200000) {
        color = 'FF9999'
      }

      sales.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    }
    );

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow(['Planilha de Inscritos exportada em: ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'B5CDF1' }
    };
    footerRow.alignment = { vertical: 'middle', horizontal: 'center' }

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })
  }
}