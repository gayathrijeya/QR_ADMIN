import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import * as QRCode from 'qrcode';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProjectMasterService } from '../Service/project-master.service';
import { ReportService } from '../Service/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {

  GridList: any = [];
  data: any;
  DropDownList: any = [];
  ngDropDown: any;

  public empCodes: any = [];
  public projectNames: any = [];
  public ngProjectDrop: any;
  public ngEmpDrop: any;
  public FirstIndex: any;
  public columnVisibilityKeys: any
  public allColumns: { labelName: string, field: string }[] = [];
  public columnVisibility: { [key: string]: boolean } = {};
  // displayedColumns: any[] = ['project','firstName', 'lastname', 'enduserid', 'phone', 'landline', 'email', 'username' , 'password', 'companyname', 'jobtitle', 'employeeid', 'department', 'address', 'summary'];
  displayedColumns: any[] = [];
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableData: any = [];
  nodata: boolean = false;
  columnFields: any[] = [];
  constructor(public Service: ApiserviceService, private modelService: NgbModal,
    public ProjectService: ProjectMasterService, public ngxLoader: NgxUiLoaderService, public ReportServ: ReportService) {
    this.FirstIndex = localStorage.getItem("UserId");
    if (this.FirstIndex != null) {
      console.log('this.FirstIndex', this.FirstIndex);

      // this.Dropdownlist(this.FirstIndex);

    }
    this.columnVisibilityKeys = Object.keys(this.columnVisibility);

  }


  ngOnInit(): void {
    this.GetDropDownList();
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<any>(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetDropDownList() {
    this.ProjectService.QrDropDownList().subscribe((res: any) => {
      console.log('p', res);
      this.DropDownList = res;
      const uniqueEmpCodes = new Set<string>(res.map((item: any) => JSON.stringify({ customer_ID: item.customer_ID, customer_Name: item.customer_Name })));
      this.empCodes = Array.from(uniqueEmpCodes).map((jsonString) => JSON.parse(jsonString) as { customer_ID: string, customer_Name: string });
    })
  }

  // Dropdownlist(id: any) {
  //   this.ReportServ.GetProjectDropDown(id).subscribe((res: any) => {
  //     console.log(res, "drop");
  //     this.DropDownList = res;
  //   })
  // }

  public masterQrDetails: any
  GetQrList(id: any) {
    this.MasterQr = '';
    this.GridList = [];
    this.ngxLoader.start();
    this.ChilQrList = [];
    this.ProjectService.GetQrList(id).subscribe((res: any) => {
      console.log(res);
      this.GridList = res;
      this.tableData = res;
      this.dataSource.data = this.tableData; // Update dataSource with new data      this.masterQrDetails = res[0]
      this.MasterQr = res[0]["master_QR_URL"];
      this.MasterQrCodeId = res[0]["master_QR_ID"];
      for (let i = 0; i < this.GridList.length; i++) {
        if (this.GridList[i].end_Customer_QR) {
          this.ChilQrList.push({ "end_Customer_QR": this.GridList[i].end_Customer_QR, "EndUserId": this.GridList[i].end_Customer_ID });
        }
      }
    })
    this.ngxLoader.stop();
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  MasterQr: any = "";
  ChilQrList: any = [];
  MasterQrCodeId: any;

  async generatePDF(jsonDataArray: any[]): Promise<jsPDF> {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const centerX: any = pageWidth / 2;
    const recepit: any = "MASTER QR CODE ";
    var pageSize = doc.internal.pageSize;
    var pageWidths = pageSize.width;
    var centerXs: any = pageWidths / 2;
    doc.text(centerXs, 8, recepit, { align: 'center' });
    // Add Master QR Code
    const masterQrCodeDataUrl = await QRCode.toDataURL(this.MasterQr); // Replace 'MASTER QR CODE DATA' with actual data
    doc.addImage(masterQrCodeDataUrl, 'PNG', centerX - 25, 15, 50, 50);
    doc.text(centerX, 65, this.MasterQrCodeId, { align: 'center' });


    var startX: any = 3;
    var endX: any = 200;
    var y: any = 70;
    var dotWidth = 1;
    var dotSpacing = 2;
    for (var x = startX; x < endX; x += dotSpacing) {
      doc.line(x, y, x + dotWidth, y);
    }
    // Add Customer QR Code title
    var head2: any = 'Customer QR Codes';
    doc.text(centerX, 80, head2, { align: 'center' });
    let xOffset = 25;
    let yOffset = 95;
    const qrCodeSize = 45;
    const maxQRCodesPerPage = Math.floor((pageWidth - 20) / (qrCodeSize + 10)) * Math.floor((doc.internal.pageSize.height - 20) / (qrCodeSize + 10));
    let qrCodeCounter = 0;

    for (const jsonData of jsonDataArray) {
      if (qrCodeCounter === 0) {
        const maxQRCodesFirstPage = 9;
        if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesFirstPage === 0) {
          doc.addPage(); // Start a new page after maxQRCodesPerPage
          xOffset = 25;  // Reset xOffset for the new page
          yOffset = 10;  // Reset yOffset for the new page
        }
      } else {
        // Subsequent pages: Print 12 QR codes
        const maxQRCodesPerPage = 12;
        if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesPerPage === 9) {
          doc.addPage(); // Start a new page after maxQRCodesPerPage
          xOffset = 25;  // Reset xOffset for the new page
          yOffset = 10;  // Reset yOffset for the new page
        }
      }
      const qrCodeDataUrl = await QRCode.toDataURL(jsonData.Bname);
      doc.addImage(qrCodeDataUrl, 'PNG', xOffset, yOffset, qrCodeSize, qrCodeSize);

      // Add EndUserId below each QR code
      const endUserIdText = jsonData.EndUserId;
      const endUserIdX: any = xOffset + qrCodeSize / 2;
      const endUserIdY = yOffset + qrCodeSize + 5; // Adjust this value to set the vertical position
      doc.text(endUserIdX, endUserIdY, endUserIdText, { align: 'center' });

      xOffset += qrCodeSize + 10;

      if (xOffset + qrCodeSize > pageWidth) {
        xOffset = 25;
        yOffset += qrCodeSize + 25; // Adjust this value to set the vertical spacing
      }
      qrCodeCounter++;
    }

    return doc;
  }

  async downloadAllQr() {
    this.ngxLoader.start();
    const jsonData = this.ChilQrList;
    const pdf = await this.generatePDF(jsonData);
    setTimeout(() => {
      pdf.save('QrCodesList.pdf');
      this.ngxLoader.stop();
    }, 900);
  }

  onSelectEmpCode() {
    this.projectNames = [];
    this.ngProjectDrop = '-1';
    this.projectNames = this.DropDownList.filter((item: any) => item.customer_ID === this.ngEmpDrop);
    console.log('this.projectNames', this.projectNames);

  }



  ClickDropDown() {
    console.log(this.ngProjectDrop, this.ngEmpDrop, "11111");
    if (this.ngProjectDrop != "All") {
      this.GetGridList(this.ngProjectDrop, this.ngEmpDrop)
    } else {
      this.ShowAllreport(this.ngEmpDrop)
    }
  }

  GetGridList(name: any, id: any) {
    this.ngxLoader.start();
    this.ReportServ.GetCusReport(name, id).subscribe((res: any) => {
      console.log(res, "list");
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.tableData = res;
      if (this.tableData.length > 0) {
        const branch = this.tableData[0];
        const values = Object.keys(branch);
        this.allColumns = values.map(key => ({
          labelName: key.split('_').join(' '),
          field: key
        }));
        this.allColumns.forEach(column => {
          this.columnVisibility[column.field] = true; // All columns visible by default
        });
        this.updateDisplayedColumns();
      }
      if (res["result"] == "nodata") {
        this.nodata = true;
      }
      this.ngxLoader.stop();
    })
  }

  ShowAllreport(id: any) {
    this.ReportServ.ShowAllReport(id).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.tableData = res;
      if (this.tableData.length > 0) {
        const branch = this.tableData[0];
        const values = Object.keys(branch);
        this.allColumns = values.map(key => ({
          labelName: key.split('_').join(' '),
          field: key
        }));
        this.allColumns.forEach(column => {
          this.columnVisibility[column.field] = true; // All columns visible by default
        });
        this.updateDisplayedColumns();
      }
      if (res["result"] == "nodata") {
        this.nodata = true;
      }
    })
  }


  public exportableToExcel(): void {
    const table = document.getElementById('httptrace-table');
    if (!table) {
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    // Set the width of the third column to 70px
    ws['!cols'] = [{ width: 10 }, { width: 10 }, { width: 50 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Report');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName + '.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  }

  open(content: any) {
    this.modelService.open(content, { backdrop: 'static' })
  }

  toggleColumn(column: { field: string, labelName: string }) {
    this.columnVisibility[column.field] = !this.columnVisibility[column.field];
    this.updateDisplayedColumns();
  }

  // Check if a column is visible
  isColumnVisible(column: { field: string, labelName: string }): boolean {
    return this.columnVisibility[column.field];
  }

  // Update the displayedColumns array based on the visibility status
  updateDisplayedColumns() {
    this.displayedColumns = this.allColumns
      .filter(column => this.columnVisibility[column.field])
      .map(column => column.field);
  }

}



// GetDropDownList() {
//   this.ngxLoader.start();
//   this.ProjectService.QrDropDownList().subscribe((res: any) => {
//     console.log(res, "DropDown");
//     this.DropDownList = res;
//     const uniqueEmpCodes = new Set<string>(res.map((item: any) => JSON.stringify({ empcode: item.empcode, name: item.name })));
//     this.empCodes = Array.from(uniqueEmpCodes).map((jsonString) => JSON.parse(jsonString) as { empcode: string, name: string });
//     console.log(this.empCodes, "empCodes");
//   })
//   this.ngxLoader.stop();
// }



// onSelectEmpCode() {
//   this.projectNames = [];
//   this.ngProjectDrop = '-1';
//   this.projectNames = this.DropDownList.filter((item: any) => item.empcode === this.ngEmpDrop);
//   console.log(this.projectNames, " this.projectNames");
// }
