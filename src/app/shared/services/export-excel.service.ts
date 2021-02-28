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
    const description = excelData.description;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Dados dos Inscritos');

    //Add Row and formating
    worksheet.mergeCells('A1', 'J4');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: "middle", horizontal: "center" }

    worksheet.mergeCells('A5', 'J6');
    let descriptionRow = worksheet.getCell('A5');
    descriptionRow.value = description;
    descriptionRow.font = {
      name: 'Calibri',
      size: 12,
      color: { argb: '000' }
    }
    descriptionRow.alignment = { vertical: "middle", horizontal: "left" }

    // Date
    let d = new Date();
    let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();

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

    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 10;
    worksheet.getColumn(9).width = 13;
    worksheet.getColumn(10).width = 50;
    
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