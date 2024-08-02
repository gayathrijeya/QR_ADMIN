import { Component, OnInit, ViewChild } from '@angular/core';
import { appMasterModel } from '../Model/appMasterModel';
import { ApiserviceService } from '../apiservice.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-applicationmaster',
  templateUrl: './applicationmaster.component.html',
  styleUrls: ['./applicationmaster.component.scss']
})
export class ApplicationmasterComponent implements OnInit {

  public appMasterModel: appMasterModel = new appMasterModel();
  @ViewChild('appMasterModelsForm', { static: false }) appMasterModelsForm!: NgForm;
  public buttonName: any = 'Save';

  constructor(public api: ApiserviceService) { }

  ngOnInit(): void {
    this.appMasterModel.App_Name = "";
    this.appMasterModel.Sub_Domain_Name = "";
    this.loadData();
  }

  appdata: any;
  loadData() {
    this.api.getApplicationMaster().subscribe((data: any) => {
      this.appdata = data;
      console.log(data, "data");

    });
  }

  onUpdate(data: any) {
    this.buttonName = 'Update'
    this.appMasterModel.App_Code = data.app_Code;
    this.appMasterModel.App_Name = data.app_Name;
    this.appMasterModel.Sub_Domain_Name = data.sub_Domain;
  }

  saveForm() {
    if(this.appMasterModel.App_Code){
      this.api.updateApplicationMaster(this.appMasterModel).subscribe((res: any) => {
        if (res === "Updated") {
          console.log(res, "response");
          Swal.fire({
            title: 'success',
            text: 'Application Master Details Updated Successfully',
            icon: 'success'
          })
          this.loadData();
          this.buttonName = 'Save'
          this.ClearFn();
          this.appMasterModelsForm.resetForm();

        }
        else {
          console.log(res, "response");
          alert('Application Master Details Updated Failed')
        }
      });
    }else{
      console.log(this.appMasterModel, "model");
      this.api.insertApplicationMaster(this.appMasterModel).subscribe((res: any) => {
          if (res === "Saved") {
          console.log(res, "response");
          Swal.fire({
            title: 'success',
            text: 'Application Master Details Added Successfully',
            icon: 'success'
          });
          this.loadData();
          this.ClearFn();
          this.appMasterModelsForm.resetForm();

        }
        else {
          console.log(res, "response");
          alert('Application Master Details Failed')
        }
      });
    }
  }

  // updateForm() {
  //   console.log(this.appMasterModel, "model");
  //   this.api.updateApplicationMaster(this.appMasterModel).subscribe((res: any) => {
  //     if (res === "Updated") {
  //       console.log(res, "response");
  //       Swal.fire({
  //         title: 'success',
  //         text: 'Application Master Details Updated Successfully',
  //         icon: 'success'
  //       })
  //       this.loadData();
  //       this.ClearFn();
  //     }
  //     else {
  //       console.log(res, "response");
  //       alert('Application Master Details Updated Failed')
  //     }
  //   });
  // }

  ClearFn() {
    this.appMasterModel.App_Name = "";
    this.appMasterModel.Sub_Domain_Name = "";
    this.appMasterModel.App_Code = "";
    this.loadData();
  }

  EnterKey(event: any) {
    console.log(event);
    debugger
    if (event.key === 'Enter') {
      this.saveForm();
    }
  }

}
