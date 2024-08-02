import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-customermasterlist',
  templateUrl: './customermasterlist.component.html',
  styleUrls: ['./customermasterlist.component.scss']
})
export class CustomermasterlistComponent {
  constructor(public api: ApiserviceService, public router: Router, public ngxLoader: NgxUiLoaderService) { }

  data: any[] = [];
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.getCustomerMasters().subscribe(response => {
      console.log(response,'oooooo')
      this.data = response;
    })
  }

  onUpdate(id: any) {
    this.router.navigateByUrl('/customermaster');
    localStorage.setItem("EditCustomer", id)
  }

  onDelete(id: any) {
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
        this.api.DeleteCustomer(id).subscribe((res: any) => {
          console.log(res, "delete");
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

  IsActive(id: any, data: any) {
    console.log(data);
    let Deactive = parseFloat(data.isDeactive)
    if (Deactive == 0) {
      var IsDeactive = 1;            
      this.api.updateIsActive(id,IsDeactive).subscribe((res:any)=>{
       console.log(res);
       this.loadData()
      })
    }else{
      var IsDeactive = 0;            
      this.api.updateIsActive(id,IsDeactive).subscribe((res:any)=>{
       console.log(res);
       this.loadData()
      })
    }

  
  }

}
