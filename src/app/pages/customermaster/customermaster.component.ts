import { Component, } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiserviceService } from '../apiservice.service';
import { CustomerMasters } from '../Model/CustomerMaster.Model';
declare var $: any;
import * as QRCode from 'qrcode';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
const doc = new jsPDF('p');

@Component({
  selector: 'app-customermaster',
  templateUrl: './customermaster.component.html',
  styleUrls: ['./customermaster.component.scss']
})
export class CustomermasterComponent {
  submitted = false;
  EditId: any;

  constructor(public Router: Router, public api: ApiserviceService, public ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
    this.EditId = localStorage.getItem("EditCustomer");
    if (this.EditId != null) {
      this.GetEditList();
    } else {
      console.log(this.EditId, "id");
      this.getCustomerCode();
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem("EditCustomer");
    this.EditId = null;
  }

  public CustomerMaster: CustomerMasters = new CustomerMasters();
  popupMasterQrCode: any = "";
  Popup_Name: any;
  Popup_Mobile: any;
  popUpCustomerCode: any;

  EnterKey(event: any) {
    console.log(event);
    debugger
    if (event.key === 'Enter') {
      this.saveForm();
    }
  }

  saveForm() {
    this.ngxLoader.start();
    if (this.EditId != null) {
      this.api.DeleteCustomer(this.EditId).subscribe((res: any) => {
        this.api.insertCustomerMasters(this.CustomerMaster).subscribe((res: any) => {
          console.log(res, "9");

          this.popupMasterQrCode = "https://sub.scangoldqr.com/signup/" + res["empcode"];
          this.Popup_Name = res["name"];
          this.Popup_Mobile = res["mobile"];
          this.popUpCustomerCode = res["empcode"];

          if (res["id"] != "") {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '  Customer Updated Successfully',
              showConfirmButton: false,
              timer: 2000
            });
            localStorage.removeItem("EditCustomer");
            setTimeout(() => {
              this.Router.navigateByUrl("/customermasterlist")
            }, 2100);
          }
          this.getCustomerCode();
        })
      })
    } 
    else {     
      this.api.insertCustomerMasters(this.CustomerMaster).subscribe((res: any) => {
        if (res["id"] != "") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '  Customer Added Successfully',
            showConfirmButton: false,
            timer: 2000
          });
          setTimeout(() => {
            this.ReloadFn();
          }, 2100);
        }
        this.getCustomerCode();

      })
    }
    this.ngxLoader.stop();
  }

  ClearFn() {
    this.CustomerMaster = new CustomerMasters();
    this.getCustomerCode();
    localStorage.removeItem("EditCustomer");   
  }

  //Get Customer Details while page load for update
  GetEditList() {
    this.api.CustomerEditList(this.EditId).subscribe((res: any) => {
      console.log(res, "edit values");
      this.CustomerMaster.App_Code = "";
      this.CustomerMaster.Customer_ID = res[0]["customer_ID"];
      this.CustomerMaster.Customer_Name = res[0]["customer_Name"];
      this.CustomerMaster.Email = res[0]["email"];
      this.CustomerMaster.Mobile = res[0]["mobile"];
      this.CustomerMaster.Pincode = res[0]["pincode"];
      this.CustomerMaster.PermanentAddress = res[0]["permanentAddress"];
      this.CustomerMaster.Notes = res[0]["notes"];
      this.CustomerMaster.UserName = res[0]["userName"];
      this.CustomerMaster.Password = res[0]["password"];
    })
  }

  ReloadFn() {
    window.location.reload();
  }

  getCustomerCode() {
    this.ngxLoader.start();
    this.api.getCustomerMaxCode().subscribe(res => {      
      this.CustomerMaster.Customer_ID = res;
    })
    this.ngxLoader.stop();
  }

  // generateQRCode(data: any): Promise<string> {
  //   return QRCode.toDataURL(data);
  // }
  // async DownloadPdf() {
  //   this.ngxLoader.start();
  //   const doc = new jsPDF('p');
  //   let topMargin: any = 5;
  //   let xOffset = 10;
  //   let yOffset = 10;
  //   const qrCodeSize = 50;
  //   const jsonData = this.popupMasterQrCode;
  //   const qrCodeDataUrl = await this.generateQRCode(jsonData);
  //   doc.addImage(qrCodeDataUrl, 'PNG', 10, 10, 50, 50);
  //   // Embed the QR code in the PDF
  //   doc.save('Master Qr Code.pdf');
  //   this.ngxLoader.stop();
  // }
 
  isSameMobile() {
    if (this.EditId == null) {
      this.api.MobileNumCheck(this.CustomerMaster.Mobile).subscribe((res: any) => {
        console.log(res, "monbile");
        if (res != '') {
          Swal.fire({
            icon: "error",
            title: "Mobile Number "+this.CustomerMaster.Mobile,
            text: "Already exist!"
          });
          this.CustomerMaster.Mobile = null;
        }
      })
    }
  }

  isSameUserName() {
    if (this.EditId == null) {
      this.api.UserNameCheck(this.CustomerMaster.UserName).subscribe((res: any) => {
        console.log(res, "UserName");
        if (res != '') {
          Swal.fire({
            icon: "error",
            title: "UserName  "+this.CustomerMaster.UserName,
            text: "Already exist! Try another username",
          });
          this.CustomerMaster.UserName = null;
        }
      })
    }
  }

}
