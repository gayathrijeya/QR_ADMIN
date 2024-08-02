import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public ApiUrl = environment.url;
  constructor(public _httpClient: HttpClient) { }

  Save(postdata: any) {
    return this._httpClient.post(this.ApiUrl + "api/UserMasters", postdata)
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  GetUserList() {
    return this._httpClient.get(this.ApiUrl + "api/UserMasters")
  }

  DeleteUser(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/UserMasters/DeleteUser?id=" + id)
  }

  UserEditList(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/UserMasters/EditUser?id=" + id)
  }

}
