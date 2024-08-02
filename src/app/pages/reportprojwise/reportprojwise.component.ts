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
  selector: 'app-reportprojwise',
  templateUrl: './reportprojwise.component.html',
  styleUrls: ['./reportprojwise.component.scss']
})
export class ReportprojwiseComponent {
  GridList: any = [];
  data: any;

  DropDownList: any = [];
  ngDropDown: any;

  empCodes: any = [];
  projectNames: any = [];
  ngProjectDrop: any;
  ngEmpDrop: any;
  FirstIndex: any;
  public columnVisibilityKeys: any
  constructor(public Service: ApiserviceService, private modelService: NgbModal,
    public ProjectService: ProjectMasterService, public ngxLoader: NgxUiLoaderService,
    public ReportServ: ReportService) {
    this.columnVisibilityKeys = Object.keys(this.columnVisibility);

  }

  ngOnInit(): void {
    this.FirstIndex = localStorage.getItem("UserId");
    this.Dropdownlist(this.FirstIndex);
  }

  Dropdownlist(id: any) {
    this.ReportServ.GetAllProjectDropDown().subscribe((res: any) => {
      console.log(res, "drop");
      this.DropDownList = res;
    })
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetDropDownList() {
    this.ngxLoader.start();
    this.ProjectService.QrDropDownList().subscribe((res: any) => {
      console.log(res, "DropDown");
      this.DropDownList = res;
      const uniqueEmpCodes = new Set<string>(res.map((item: any) => JSON.stringify({ empcode: item.empcode, name: item.name })));
      this.empCodes = Array.from(uniqueEmpCodes).map((jsonString) => JSON.parse(jsonString) as { empcode: string, name: string });
      console.log(this.empCodes, "empCodes");
    })
    this.ngxLoader.stop();
  }



  onSelectEmpCode() {
    this.projectNames = [];
    this.ngProjectDrop = '-1';
    this.projectNames = this.DropDownList.filter((item: any) => item.empcode === this.ngEmpDrop);
    console.log(this.projectNames, " this.projectNames");
  }




  displayedColumns: string[] = ['project', 'firstName', 'lastname', 'enduserid', 'phone', 'landline', 'email', 'username', 'password', 'companyname', 'jobtitle', 'employeeid', 'department', 'address', 'summary'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableData: any = [];
  nodata: boolean = false;

  ClickDropDown() {
    console.log(this.ngDropDown, "ssss");
    if (this.ngDropDown != "All") {
      this.GetGridList(this.ngDropDown);
    } else {
      this.ShowAllreport();
    }
  }

  GetGridList(id: any) {
    this.ngxLoader.start();
    this.ReportServ.getAllProjectDatabyCode(id).subscribe((res: any) => {
      console.log(res, "list");
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.tableData = res;
      if (res["result"] == "nodata") {
        this.nodata = true;
      }
      this.ngxLoader.stop();
    })
  }

  ShowAllreport() {
    this.ReportServ.getAllProjectData().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.tableData = res;
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


  // Define an object to track the visibility status of each column
  columnVisibility: { [key: string]: boolean } = {
    project: true,
    firstName: true,
    lastname: true,
    enduserid: true,
    phone: true,
    landline: true,
    email: true,
    username: true,
    password: true,
    companyname: true,
    jobtitle: true,
    employeeid: true,
    department: true,
    address: true,
    summary: true
  };

  // Toggle the visibility of a column
  toggleColumn(column: string) {
    console.log(column);

    this.columnVisibility[column] = !this.columnVisibility[column];
    this.updateDisplayedColumns();
  }

  // Check if a column is visible
  isColumnVisible(column: string): boolean {
    return this.columnVisibility[column];
  }
  // Update the displayedColumns array based on the visibility status
  updateDisplayedColumns() {
    this.displayedColumns = Object.keys(this.columnVisibility).filter(column => this.columnVisibility[column]);
  }
}
