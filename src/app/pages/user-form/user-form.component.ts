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
import { UserService } from '../Service/user.service';
const doc = new jsPDF('p');

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  submitted = false;
  EditId: any;

  constructor(public Router: Router, public api: UserService, public ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
    this.EditId = localStorage.getItem("editUser");
    if (this.EditId != null) {
      this.GetEditList();
    }

  }


  ngOnDestroy(): void {
    localStorage.removeItem("editUser");
    this.EditId = null;
  }
  public CustomerMaster: CustomerMasters = new CustomerMasters();


  saveForm() {
    this.ngxLoader.start();
    if (this.EditId != null) {
      this.api.DeleteUser(this.EditId).subscribe((res: any) => {
        this.api.Save(this.CustomerMaster).subscribe((res: any) => {
          console.log(res, "9");
          if (res["id"] != "") {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '  User Updated Successfully',
              showConfirmButton: false,
              timer: 2000
            });
            localStorage.removeItem("editUser");
            setTimeout(() => {
              this.Router.navigateByUrl("/userlist")
            }, 2100);
          }
        })
      })
    } else {
      this.api.Save(this.CustomerMaster).subscribe((res: any) => {
        if (res["id"] != "") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '  User Added Successfully',
            showConfirmButton: false,
            timer: 2000
          });
          setTimeout(() => {
            this.ReloadFn();
          }, 2100);
        }
      })
    }
    this.ngxLoader.stop();
  }


  GetEditList() {
    this.api.UserEditList(this.EditId).subscribe((res: any) => {
      console.log(res, "edit values");
      this.CustomerMaster.Customer_Name = res[0]["name"];
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
  // getCustomerCode() {
  //   this.ngxLoader.start();
  //   this.api.getCustomerMaxCode().subscribe(res => {
  //     console.log(res, "122");
  //     this.CustomerMaster.Empcode = res;
  //   })
  //   this.ngxLoader.stop();
  // }

  generateQRCode(data: any): Promise<string> {
    return QRCode.toDataURL(data);
  }


  EnterKey(event: any) {
    console.log(event);

    debugger
    if (event.key === 'Enter') {
      this.saveForm();
    }
  }


  ClearFn() {
    this.CustomerMaster = new CustomerMasters();
    localStorage.removeItem("EditCustomer");
  }


}
