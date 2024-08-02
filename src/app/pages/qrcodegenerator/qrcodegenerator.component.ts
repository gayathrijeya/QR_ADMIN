import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProjectMasterService } from '../Service/project-master.service';
import { ProjectMaster } from '../Model/CustomerProjectMasterModel';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qrcodegenerator',
  templateUrl: './qrcodegenerator.component.html',
  styleUrls: ['./qrcodegenerator.component.scss']
})
export class QrcodegeneratorComponent {
  CusNameMobile: any = [];

  data: any;
  EditId: any;
  public applicationList: any;
  public ProjectMaster: ProjectMaster = new ProjectMaster();

  constructor(public api: ApiserviceService, public Router: Router, public ngxLoader: NgxUiLoaderService, public Service: ProjectMasterService) { }

  ngOnInit(): void {
    this.getNameMobile();
    this.CusMobileNo();
    this.EditId = localStorage.getItem("EditProjectMaster");
    if (this.EditId != null) {
      this.EditProjectMatser();
    } else {
      console.log(this.EditId, "id");
      this.getProjectCode();
      this.getCurrentDate();
      this.getApplicationMaster()
    }
  }
  ngOnDestroy(): void {
    localStorage.removeItem("EditProjectMaster");
    this.EditId = null;
  }

  getNameMobile() {
    this.api.getCusNameMobie().subscribe((res: any) => {
      this.CusNameMobile = res;
    })
  }

  getApplicationMaster() {
    this.Service.GetApplicationList().subscribe((res: any) => {
      this.applicationList = res
    })
  }

  CusMobileNo() {
    this.ngxLoader.start();
    this.api.getCustomerMasters().subscribe(response => {
      this.data = response;
    })
    this.ngxLoader.stop();
  }

  currentProject: any;
  getMobileBasedList() {
    this.ngxLoader.start();
    setTimeout(() => {
      this.api.getDetailsBasedOnMobileNo(this.ProjectMaster.Customer_Id).subscribe((res: any) => {
        this.ProjectMaster.Name = res[0]["customer_Name"];
        this.ProjectMaster.Customer_Id = res[0]["customer_ID"];
        this.Service.IsProjectOneOrTwo(this.ProjectMaster.Customer_Id).subscribe((res: any) => {
          const lastObject = res[res.length - 1];
          let lastobj = lastObject ? lastObject.project_Name : undefined;
          const currentProjectNumber = parseInt(lastobj?.split('-')[1]);
          const nextProjectNumber = currentProjectNumber + 1;
          this.currentProject = `Project-${nextProjectNumber}`;
          this.ProjectMaster.Project_Name = this.currentProject != "Project-NaN" ? this.currentProject : "Project-1";
        })
      })
    }, 500);

    this.ngxLoader.stop();
  }

  NameToMobile() {
    this.ngxLoader.start();
    const parts = this.ProjectMaster.Name.split('-');
    if (parts.length > 0) {
      // return parts[0]; // This will be "ajeeth"
      this.ProjectMaster.Name = parts[0];
      this.ProjectMaster.Mobile = parts[1];
      this.ProjectMaster.Customer_Id = parts[2];
      console.log(this.ProjectMaster.Customer_Id, 'this.ProjectMaster.Customer_Code');

      this.getMobileBasedList();
    }
    this.ngxLoader.stop();

  }



  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so we add 1 and pad with 0 if needed
    const day = today.getDate().toString().padStart(2, '0');
    this.ProjectMaster.Project_Date = `${year}-${month}-${day}`;
  }


  SaveFn() {
    
    let status = 'A';
    debugger
    let data = this.applicationList.find((x: any) => x.app_Code == this.ProjectMaster.App_ID);
    let obj = {
      App_ID: this.ProjectMaster.App_ID,
      Customer_ID:this.ProjectMaster.Customer_Id,
      Project_Code:this.ProjectMaster.Project_Code,
      Sub_Domain :data.sub_Domain,
      is_Active:status
   }

    this.ngxLoader.start();
    this.ProjectMaster.Master_QR_ID = this.ProjectMaster.Customer_Id + '-' + this.ProjectMaster.Project_Code;
   // this.ProjectMaster.Master_Qr_URL = 'https://' + data.sub_Domain + '.scangoldqr.com/signup/' + this.ProjectMaster.Master_QR_ID;
   this.ProjectMaster.sub_Domain =  data.sub_Domain ;
    if (this.EditId != null) {
      this.Service.DeleteMaster(this.ProjectMaster.Id).subscribe((res: any) => {
        this.Service.DeleteBusinessCard(this.ProjectMaster.Customer_Id).subscribe((res: any) => {
          this.Service.SaveFn(this.ProjectMaster).subscribe((res: any) => {
            this.Service.GenerateQrCodes(this.ProjectMaster.Noof_QR,obj).subscribe((res: any) => {
              if (res == "ok") {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Record Updated Successfully',
                  showConfirmButton: false,
                  timer: 2000
                });
                localStorage.removeItem("EditProjectMaster");
                this.getProjectCode();
                setTimeout(() => {
                  window.location.reload();
                }, 2100);
              }
            })
          })
        })
      })
    } else {
      console.log(this.ProjectMaster, "this.ProjectMaster");
      this.Service.SaveFn(this.ProjectMaster).subscribe((res: any) => {
        this.Service.GenerateQrCodes(this.ProjectMaster.Noof_QR,obj).subscribe((res: any) => {
          if (res == "ok") {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Record Added Successfully',
              showConfirmButton: false,
              timer: 2000
            });
            this.getProjectCode();
            setTimeout(() => {
              window.location.reload();
            }, 2100);
          }
        })
      })
    }
    this.ngxLoader.stop();
  }

  ReloadFn() {
    window.location.reload();
  }

  getProjectCode() {
    this.Service.GetProjectCode().subscribe((res: any) => {
      this.ProjectMaster.Project_Code = res;
    })
  }

  EditProjectMatser() {
    this.Service.EditMaster(this.EditId).subscribe((res: any) => {
      this.ProjectMaster.Customer_Id = res[0]["customer_Code"];
      this.ProjectMaster.Project_Date = res[0]["date"];
      this.ProjectMaster.Id = res[0]["id"];
      this.ProjectMaster.Name = res[0]["name"];
      this.ProjectMaster.Mobile = res[0]["mobile"];
      this.ProjectMaster.Noof_QR = res[0]["noOfDiary"];
      this.ProjectMaster.Project_Code = res[0]["project_Code"];
      this.ProjectMaster.Project_Name = res[0]["project_Name"];
      this.ProjectMaster.Project_Description = res[0]["project_Description"];
    })
  }

  UpdateFn() {

  }


  ClearFn() {
    this.ProjectMaster = new ProjectMaster();
    this.getProjectCode();
    this.getCurrentDate();
    localStorage.removeItem("EditProjectMaster");
  }

}
