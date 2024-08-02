import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../Service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  constructor(public api: UserService, public router: Router, public ngxLoader: NgxUiLoaderService) { }

  data: any[] = [];
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.GetUserList().subscribe((response: any) => {
      console.log(response, 'oooooo')
      this.data = response;
    })
  }

  onUpdate(id: any) {
    this.router.navigateByUrl('/user');
    localStorage.setItem("editUser", id)
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
        this.api.DeleteUser(id).subscribe((res: any) => {
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
}
