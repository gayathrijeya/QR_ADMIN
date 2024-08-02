import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import * as QRCode from 'qrcode';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProjectMasterService } from '../Service/project-master.service';
import { log } from 'console';

@Component({
  selector: 'app-qrcodegeneratorlist',
  templateUrl: './qrcodegeneratorlist.component.html',
  styleUrls: ['./qrcodegeneratorlist.component.scss']
})
export class QrcodegeneratorlistComponent {
  GridList: any = [];
  data: any;
  DropDownList: any = [];
  SelectAllCustomer: any =
    {
      "empcode": "0",
      "name": "Show All Customer"
    };
  ShowAllProject: any = {
    "empcode": "0",
    "name": "anandharaj107",
    "project_Name": "Show All Project"
  }
  empCodes: any = [];
  projectNames: any = [];
  ngProjectDrop: any;
  ngEmpDrop: any;
  constructor(public Service: ApiserviceService, public ProjectService: ProjectMasterService, public ngxLoader: NgxUiLoaderService) { }
  ngOnInit(): void {

    this.GetDropDownList();
  }


  MasterQr: any = "";
  public masterQrDetails: any
  ChilQrList: any = [];
  MasterQrCodeId: any;
  // GetListBasedOfEmpCode() {
  //   console.log(this.ngEmpDrop);
  //   this.ngxLoader.start();
  //   this.Service.EmpBasedQr(this.ngEmpDrop).subscribe((res: any) => {
  //     console.log(res, "suucess");
  //     this.GridList = res;
  //     this.MasterQr = res[0]["empcode"];
  //     this.MasterQrCodeId = res[0]["projectcode"];
  //     for (let i = 0; i < this.GridList.length; i++) {
  //       if (this.GridList[i].bname) {
  //         this.ChilQrList.push(this.GridList[i].bname);
  //       }
  //     }
  //   })
  //   this.ngxLoader.stop();
  // }


  GetDropDownList() {
    this.ProjectService.QrDropDownList().subscribe((res: any) => {
      this.DropDownList = res;
      const uniqueEmpCodes = new Set<string>(res.map((item: any) => JSON.stringify({ customer_ID: item.customer_ID, customer_Name: item.customer_Name })));
      this.empCodes = Array.from(uniqueEmpCodes).map((jsonString) => JSON.parse(jsonString) as { customer_ID: string, customer_Name: string });
    })
  }



  onSelectEmpCode() {
    this.projectNames = [];
    this.ngProjectDrop = '-1';
    this.projectNames = this.DropDownList.filter((item: any) => item.customer_ID === this.ngEmpDrop);
  }

  GetQrList(id: any) {

    this.MasterQr = '';
    this.GridList = [];
    this.ngxLoader.start();
    this.ChilQrList = [];
    this.ProjectService.GetQrList(id).subscribe((res: any) => {
      this.GridList = res;
      this.masterQrDetails = res[0]
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


  async generatePDF(jsonDataArray: any[]): Promise<jsPDF> {
     console.log(jsonDataArray,'jsonDataArray');
     
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const centerX: any = pageWidth / 2;
    const recepit: any = "MASTER QR CODE ";
    var pageSize = doc.internal.pageSize;
    var pageWidths = pageSize.width;
    var centerXs: any = pageWidths / 2;
    const rightX: any = pageWidth - 60;  // Adjust this value to position the image on the right side
    const textRightX: any = pageWidth - 30;  // Adjust this value to position the text on the right side

    // Ensure text is valid before calling doc.text()
    if (recepit) {
      doc.text(centerXs, 8, recepit, { align: 'center' });
    }

    //Add Master QR Code
    try {
      if (this.MasterQr) {
        const masterQrCodeDataUrl = await QRCode.toDataURL(this.MasterQr);
        // Position the image on the right
        const scaleFactor: number = 0.7; // Adjust this value to reduce the scale of the image
        const scaledWidth: number = 50 * scaleFactor; // Calculate the scaled width
        const scaledHeight: number = 50 * scaleFactor; // Calculate the scaled height
        
        // Add the image with the adjusted scale factor
        doc.addImage(masterQrCodeDataUrl, 'PNG', rightX, 20, scaledWidth, scaledHeight);
        
        const customerName: any = `CustomerName : ${this.masterQrDetails.customer_Name}`;  // Replace with dynamic value if needed
        const customerPhone: any = `Mobile : ${this.masterQrDetails.mobile}`;  // Replace with dynamic value if needed
        const customerId: any = `Customer ID : ${this.masterQrDetails.customer_ID}`;
        const projectId: any = `Project Id : ${this.masterQrDetails.project_Name}`;
        const customerNameX: any = rightX - 75;
        const customerNameY: any = 28;
        const customerPhoneY: any = customerNameY + 8;
        const customerIdY: any = customerPhoneY + 8;
        const projectIdY: any = customerIdY + 8;
        // Set font size
        const fontSize: number = 12; // Change this value to adjust the font size

        // Add each piece of information with reduced font size
        doc.setFontSize(fontSize);
        doc.text(customerNameX, customerNameY, customerName);
        doc.text(customerNameX, customerPhoneY, customerPhone);
        doc.text(customerNameX, customerIdY, customerId);
        doc.text(customerNameX, projectIdY, projectId);
      }

    } catch (error) {
      console.error("Error adding Master QR Code:", error);
    }

    if (this.MasterQrCodeId) {
      doc.text(textRightX, 60, this.MasterQrCodeId, { align: 'right' });  // Position the text on the right
    }

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
    if (head2) {
      doc.text(centerX, 80, head2, { align: 'center' });
    }

    let xOffset = 25;
    let yOffset = 95;
    const qrCodeSize = 45;
    const maxQRCodesPerPage = Math.floor((pageWidth - 20) / (qrCodeSize + 10)) * Math.floor((doc.internal.pageSize.height - 20) / (qrCodeSize + 10));
    let qrCodeCounter = 0;

    
    const imagesPerRow = 5; // Number of images per row
    const totalSpacing = 10 * (imagesPerRow - 1); // Total spacing between images
    const qrCodeWidth = qrCodeSize * 0.5; // Width of each QR code after scaling
    
    for (const jsonData of jsonDataArray) {
        let scaledWidth: number = 0; // Initialize to a default value
        let scaledHeight: number = 0; // Initialize to a default value
    
        // Check if the maximum number of QR codes per row has been reached
        if (qrCodeCounter > 0 && qrCodeCounter % imagesPerRow === 0) {
            xOffset = 25; // Reset xOffset to start a new row
            yOffset += scaledHeight + 35; // Adjust this value to set the vertical spacing
        }
    
        if (jsonData.end_Customer_QR) {
            const qrCodeDataUrl = await QRCode.toDataURL(jsonData.end_Customer_QR);
            const scaleFactor: any = 0.6; // Change this value to adjust the scale of the image
            scaledWidth = qrCodeSize * scaleFactor;
            scaledHeight = qrCodeSize * scaleFactor;
            doc.addImage(qrCodeDataUrl, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
    
            // Calculate the center position for text below the QR code
            const textCenterX: any = xOffset + scaledWidth / 2;
            const textCenterY: any = yOffset + scaledHeight + 5; // Adjust this value to set the vertical position
    
            // Add EndUserId below each QR code
            const endUserIdText = jsonData.EndUserId;
            if (endUserIdText) {
                const fontSize: number = 10; // Change this value to adjust the font size
                // Add each piece of information with reduced font size
                doc.setFontSize(fontSize);
                doc.text(textCenterX, textCenterY, endUserIdText, { align: 'center' });
            }
        }
    
        // Update xOffset for the next QR code
        xOffset += qrCodeWidth + (totalSpacing / imagesPerRow);
    
        qrCodeCounter++;
    }
    
    return doc;
  }




  async downloadAllQr() {
    console.log(this.masterQrDetails,'000');
    
    // this.ngxLoader.start();
    const jsonData = this.ChilQrList;
    const pdf = await this.generatePDF(jsonData);
    setTimeout(() => {
      pdf.save(`${this.masterQrDetails?.project_Name}.pdf`);
      // this.ngxLoader.stop();
    }, 900);
  }

}





  // for (const jsonData of jsonDataArray) {
    //   if (qrCodeCounter === 0) {
    //     const maxQRCodesFirstPage = 9;
    //     if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesFirstPage === 0) {
    //       doc.addPage(); // Start a new page after maxQRCodesPerPage
    //       xOffset = 25;  // Reset xOffset for the new page
    //       yOffset = 10;  // Reset yOffset for the new page
    //     }
    //   } else {
    //     // Subsequent pages: Print 12 QR codes
    //     const maxQRCodesPerPage = 12;
    //     if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesPerPage === 9) {
    //       doc.addPage(); // Start a new page after maxQRCodesPerPage
    //       xOffset = 25;  // Reset xOffset for the new page
    //       yOffset = 10;  // Reset yOffset for the new page
    //     }
    //   }

    //   if (jsonData.end_Customer_QR) {
    //     const qrCodeDataUrl = await QRCode.toDataURL(jsonData.end_Customer_QR);
    //     const scaleFactor = 0.5; // Change this value to adjust the scale of the image
    //     const scaledWidth = qrCodeSize * scaleFactor;
    //     const scaledHeight = qrCodeSize * scaleFactor;
    //     doc.addImage(qrCodeDataUrl, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
    // }


    //   // Add EndUserId below each QR code
    //   const endUserIdText = jsonData.EndUserId;
    //   if (endUserIdText) {
    //     const endUserIdX: any = xOffset + qrCodeSize / 2;
    //     const endUserIdY = yOffset + qrCodeSize + 5; // Adjust this value to set the vertical position
    //     doc.text(endUserIdX, endUserIdY, endUserIdText, { align: 'center' });
    //   }

    //   xOffset += qrCodeSize + 10;

    //   if (xOffset + qrCodeSize > pageWidth) {
    //     xOffset = 25;
    //     yOffset += qrCodeSize + 25; // Adjust this value to set the vertical spacing
    //   }
    //   qrCodeCounter++;
    // }





// async generatePDF(jsonDataArray: any[]): Promise<jsPDF> {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   let topMargin: any = 5;
//   const recepit: any = "MASTER QR CODE ";
//   var pageSize = doc.internal.pageSize;
//   var pageWidths = pageSize.width;
//   var centerX: any = pageWidths / 2;
//   doc.text(centerX, 8, recepit, { align: 'center' });
//   const pageWidth = doc.internal.pageSize.width;
//   const pageHeight = doc.internal.pageSize.height;
//   const qrCodeSize = 50;
//   const maxQRCodesPerPage = Math.floor((pageWidth - 20) / (qrCodeSize + 10)) * Math.floor((pageHeight - 20) / (qrCodeSize + 10));
//   let xOffset = 10;
//   let yOffset = 10;
//   let qrCodeCounter = 0;
//   console.log(jsonDataArray, "7");
//   console.log("befor for", jsonDataArray);
//   for (const jsonData of jsonDataArray) {
//     console.log(jsonData, "anansh");
//     if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesPerPage === 0) {
//       doc.addPage(); // Start a new page after maxQRCodesPerPage
//       xOffset = 10;  // Reset xOffset for the new page
//       yOffset = 10;  // Reset yOffset for the new page
//     }
//     const qrCodeDataUrl = await QRCode.toDataURL(jsonData);
//     doc.addImage(qrCodeDataUrl, 'PNG', xOffset, yOffset, qrCodeSize, qrCodeSize);

//     // Adjust the xOffset and yOffset for the next QR code
//     xOffset += qrCodeSize + 10;

//     // If the xOffset goes beyond the page width, move to the next row
//     if (xOffset + qrCodeSize > pageWidth) {
//       xOffset = 10;
//       yOffset += qrCodeSize + 10;
//     }
//     qrCodeCounter++;
//   }

//   return doc;
// }

// async DownloadAllQr() {
//   this.ngxLoader.start();
//   console.log(this.ChilQrList, "anansh");
//   const jsonData = this.ChilQrList;
//   var pdf = await this.generatePDF(jsonData);


//   // Save or display the PDF
//   setTimeout(() => {
//     pdf.save('QrCodesList.pdf');
//   }, 900);
//   this.ngxLoader.stop();
// }



// async generatePDF(jsonDataArray: any[]): Promise<jsPDF> {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const centerX: any = pageWidth / 2;
//   const recepit: any = "MASTER QR CODE ";
//   var pageSize = doc.internal.pageSize;
//   var pageWidths = pageSize.width;
//   var centerXs: any = pageWidths / 2;
//   doc.text(centerXs, 8, recepit, { align: 'center' });
//   // Add Master QR Code
//   const masterQrCodeDataUrl = await QRCode.toDataURL(this.MasterQr); // Replace 'MASTER QR CODE DATA' with actual data
//   doc.addImage(masterQrCodeDataUrl, 'PNG', centerX - 25, 15, 50, 50);
//   // var head1:any='Master QR Code';
//   // doc.text(centerX, 75, head1, { align: 'center' });

//   var startX: any = 3;
//   var endX: any = 200;
//   var y: any = 65;
//   var dotWidth = 1;
//   var dotSpacing = 2;
//   for (var x = startX; x < endX; x += dotSpacing) {
//     doc.line(x, y, x + dotWidth, y);
//   }


//   // Add Customer QR Code title
//   var head2: any = 'Customer QR Codes';
//   doc.text(centerX, 75, head2, { align: 'center' });

//   let xOffset = 25;
//   let yOffset = 85; // Adjusted yOffset to start below the Master QR Code

//   const qrCodeSize = 45;
//   const maxQRCodesPerPage = Math.floor((pageWidth - 20) / (qrCodeSize + 10)) * Math.floor((doc.internal.pageSize.height - 20) / (qrCodeSize + 10));
//   let qrCodeCounter = 0;

//   for (const jsonData of jsonDataArray) {
//     if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesPerPage === 0) {
//       doc.addPage(); // Start a new page after maxQRCodesPerPage
//       xOffset = 25;  // Reset xOffset for the new page
//       yOffset = 10;  // Reset yOffset for the new page
//     }
//     const qrCodeDataUrl = await QRCode.toDataURL(jsonData.Bname);
//     doc.addImage(qrCodeDataUrl, 'PNG', xOffset, yOffset, qrCodeSize, qrCodeSize);


//     xOffset += qrCodeSize + 10;


//     if (xOffset + qrCodeSize > pageWidth) {
//       xOffset = 25;
//       yOffset += qrCodeSize + 10;
//     }
//     qrCodeCounter++;
//   }

//   return doc;
// }

//** old **//
// async generatePDF(jsonDataArray: any[]): Promise<jsPDF> {
//   console.log(jsonDataArray);

//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const centerX: any = pageWidth / 2;
//   const recepit: any = "MASTER QR CODE ";
//   var pageSize = doc.internal.pageSize;
//   var pageWidths = pageSize.width;
//   var centerXs: any = pageWidths / 2;
//   doc.text(centerXs, 8, recepit, { align: 'center' });
//   // Add Master QR Code
//   const masterQrCodeDataUrl = await QRCode.toDataURL(this.MasterQr); // Replace 'MASTER QR CODE DATA' with actual data
//   doc.addImage(masterQrCodeDataUrl, 'PNG', centerX - 25, 15, 50, 50);
//   doc.text(centerX, 65, this.MasterQrCodeId, { align: 'center' });


//   var startX: any = 3;
//   var endX: any = 200;
//   var y: any = 70;
//   var dotWidth = 1;
//   var dotSpacing = 2;
//   for (var x = startX; x < endX; x += dotSpacing) {
//     doc.line(x, y, x + dotWidth, y);
//   }
//   // Add Customer QR Code title
//   var head2: any = 'Customer QR Codes';
//   doc.text(centerX, 80, head2, { align: 'center' });
//   let xOffset = 25;
//   let yOffset = 95;
//   const qrCodeSize = 45;
//   const maxQRCodesPerPage = Math.floor((pageWidth - 20) / (qrCodeSize + 10)) * Math.floor((doc.internal.pageSize.height - 20) / (qrCodeSize + 10));
//   let qrCodeCounter = 0;

//   for (const jsonData of jsonDataArray) {
//     if (qrCodeCounter === 0) {
//       const maxQRCodesFirstPage = 9;
//       if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesFirstPage === 0) {
//         doc.addPage(); // Start a new page after maxQRCodesPerPage
//         xOffset = 25;  // Reset xOffset for the new page
//         yOffset = 10;  // Reset yOffset for the new page
//       }
//     } else {
//       // Subsequent pages: Print 12 QR codes
//       const maxQRCodesPerPage = 12;
//       if (qrCodeCounter > 0 && qrCodeCounter % maxQRCodesPerPage === 9) {
//         doc.addPage(); // Start a new page after maxQRCodesPerPage
//         xOffset = 25;  // Reset xOffset for the new page
//         yOffset = 10;  // Reset yOffset for the new page
//       }
//     }
//     const qrCodeDataUrl = await QRCode.toDataURL(jsonData.Bname);
//     doc.addImage(qrCodeDataUrl, 'PNG', xOffset, yOffset, qrCodeSize, qrCodeSize);

//     // Add EndUserId below each QR code
//     const endUserIdText = jsonData.EndUserId;
//     const endUserIdX: any = xOffset + qrCodeSize / 2;
//     const endUserIdY = yOffset + qrCodeSize + 5; // Adjust this value to set the vertical position
//     doc.text(endUserIdX, endUserIdY, endUserIdText, { align: 'center' });

//     xOffset += qrCodeSize + 10;

//     if (xOffset + qrCodeSize > pageWidth) {
//       xOffset = 25;
//       yOffset += qrCodeSize + 25; // Adjust this value to set the vertical spacing
//     }
//     qrCodeCounter++;
//   }

//   return doc;
// }


// async downloadAllQr() {
//   // this.ngxLoader.start();
//   const jsonData = this.ChilQrList;
//   const pdf = await this.generatePDF(jsonData);
//   console.log(pdf,'p');

//   setTimeout(() => {
//     pdf.save('QrCodesList.pdf');
//     // this.ngxLoader.stop();
//   }, 900);

// }
