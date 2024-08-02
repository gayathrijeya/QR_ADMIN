import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectMasterService {

  public ApiUrl = environment.url;
  constructor(public _httpClient: HttpClient) { }

  SaveFn(obj: any) {
    return this._httpClient.post(this.ApiUrl + "api/CustomerProjectMasters", obj)
  }

  GetProjectCode() {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/getProjectCode")
  }

  // GenerateQrCodes(cusid: any, projectid: any, noof: any,appid:any,status:any, url:any) {
  //   return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/InsertQrData?cusid=" + cusid + "&projectid=" + projectid + "&noof=" + noof + "&appid=" + appid + "&status=" + status + "&subdomain=" + url)
  // }

  GenerateQrCodes(noof: any, data: any) {
    return this._httpClient.post(this.ApiUrl + "api/CustomerProjectMasters/InsertQrData?&noof=" + noof, data)
  }

  GetMasterList() {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/getCustomerMasterList")
  
  }

  
  GetQRList() {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/getCustomerProjectMaster")
  }

  GetQRListbyMasterQR(id:any) {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/getSubQRCodes?masterId="+ id);
  }

  DeleteMaster(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/DeleteProjectMaster?id=" + id)
  }

  EditMaster(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/EditProjectMaster?id=" + id)
  }

  DeleteBusinessCard(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/DeleteCustomerBusinessCard?id=" + id)
  }

  IsProjectOneOrTwo(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/IsProjectOneRtwo?id=" + id)
  }

  QrDropDownList() {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/QrDropDownList")
  }

  GetQrList(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/CustomerProjectMasters/GetQrCodeList?id=" + id)
  }

  GetApplicationList() {
    return this._httpClient.get(`${this.ApiUrl}api/CustomerProjectMasters/GetApplicationMaster`)
  }


}
