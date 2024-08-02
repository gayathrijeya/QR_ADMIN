import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  public ApiUrl = environment.url;
  public ImageUrl=environment.url;
  constructor(public _httpClient: HttpClient,) { }

  getAllProjectDatabyCode(id:any)
  {
    return this._httpClient.get(this.ApiUrl + "api/MasterInformations/getAllProjectDatabyPCode?id=" + id);
  }

  getAllProjectData()
  {
    return this._httpClient.get(this.ApiUrl + "api/MasterInformations/getAllProjectData")
  }

  GetAllProjectDropDown() {
    return this._httpClient.get(this.ApiUrl + "api/MasterInformations/getAllProjects")
  }

  GetProjectDropDown(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/MasterInformations/SubProjectDropDown?id=" + id)
  }

  GetCusReport(ProjectName: any,id:any) {
    return this._httpClient.get(this.ApiUrl + "api/MasterInformations/CustomerReport?pcode=" + ProjectName+"&id="+id)
  }

  ShowAllReport(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/MasterInformations/CustomerReportShowAll?id=" + id)
  }

  UploadEmployeeImg(Banner:any): Observable<any> {
    return this._httpClient
      .post(
        this.ApiUrl + 'api/BasicInformations/SaveBannerFiles',
        Banner
      )
  }


  GetBanner(EnduserId: any) {
    return this._httpClient.get(this.ApiUrl + "api/BasicInformations/getBanner?EnduserId=" + EnduserId)
  }

  GetBanners(EnduserId: any) {
    return this._httpClient.get(this.ApiUrl + "api/BasicInformations/getBanner?EnduserId=" + EnduserId)
  }

  isactive(userId: any) {
    return this._httpClient.get(this.ApiUrl + "api/BasicInformations/isactive?userId=" + userId)
  }


  GetUserList(prefix: any) {
    return this._httpClient.get(this.ApiUrl + "api/Reminder/GetUsersList?enduserid=" + prefix)
  }

  SaveReminder(Reminder:any): Observable<any> {
    return this._httpClient
      .post(
        this.ApiUrl + 'api/Reminder/SaveReminderFiles',
        Reminder
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }


  GetReminderList(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/Reminder/GetReminderList?id=" + id)
  }


  DeleteReminder(id: any) {
    return this._httpClient.get(this.ApiUrl + "api/Reminder/deleteReminder?id=" + id)
  }


  ChangeReminder(id: any, active: any) {
    return this._httpClient.get(this.ApiUrl + "api/Reminder/reminderStatus?id=" + id + "&active=" + active + "")

  }

}
