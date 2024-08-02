import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProjectMasterService } from '../Service/project-master.service';
@Component({
  selector: 'app-project-masterlist',
  templateUrl: './project-masterlist.component.html',
  styleUrls: ['./project-masterlist.component.scss']
})
export class ProjectMasterlistComponent {

  constructor(public Service: ProjectMasterService, public router: Router, public ngxLoader: NgxUiLoaderService) { }

  data: any[] = [];
  sub_data: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.Service.GetQRList().subscribe((res: any) => {
      console.log(res,"lli");      
      this.data = res;
    })
  }

  Edit(id: any) {
    this.router.navigateByUrl('/Projectmaster');
    localStorage.setItem("EditProjectMaster", id)
  }

  Hide(id:any)
  {
    id.viewop = 0;
  }

  View(id:any)
  {          
    id.viewop = 1;
    var m_id = id.master_QR_ID;        
    this.data.forEach((e:any) => {
      console.log("for", m_id, e.master_QR_ID);
      if (m_id == e.master_QR_ID){
        e.viewop = 1;
      }
      else
      {
        e.viewop = 0;
      }
    });  
    this.Service.GetQRListbyMasterQR(m_id).subscribe((res: any) => {
      console.log(res,"Sub");      
      this.sub_data = res;
    })
  }

  Delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this Record Details !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ngxLoader.start();
        this.Service.DeleteMaster(id).subscribe((res:any) => {
          console.log(res,"delete");
          this.ngxLoader.stop();
          if (res == "Deleted") {
            Swal.fire(
              'Deleted!',
              'Records Deleted Successfully!',
              'success'
            )
          }
          this.loadData();
        });
      } 
    });
  }

}
