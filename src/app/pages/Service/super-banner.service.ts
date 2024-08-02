import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperBannerService {

  public ApiUrl = environment.url;
  constructor(public _httpClient: HttpClient) { }


  UploadBannerImage(Banner:any): Observable<any> {
    return this._httpClient
      .post(
        this.ApiUrl + 'api/banner/SaveBanner',
        Banner
      )
  }

  GetBanner() {
    return this._httpClient.get(this.ApiUrl + "api/banner/getBanner")
  }
}
