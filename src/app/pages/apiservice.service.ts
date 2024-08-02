import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  public url=environment.url;
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) { }

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

    //url = this.sanitizer.bypassSecurityTrustUrl("https://qrdataapi.brosonetech.com/");
  //url = "https://qrdataapi.brosonetech.com/";
 
  POST(path: string, body: Object = {}): Observable<any> {
     console.log(JSON.stringify(body), "body");
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }
  private formatErrors(error: any) {
    return throwError(error.error);
  }

  //Application
  //Post
  insertApplicationMaster(postdata: any): Observable<any> {              
    return this.http.post(this.url + "api/App/postAppMaster", postdata);
  }
  //Get
  getApplicationMaster() {
    return this.http.get<any>(this.url + "api/App/getAppMaster").pipe(map((res) => {
      return res
    }))
  }
  //Update
  updateApplicationMaster(postdata: any): Observable<any> {              
    return this.http.post(this.url + "api/App/updateAppMaster", postdata);
  }

  insertAttenderMaster(postdata: any): Observable<any> {
    return this.http.post(this.url + "api/AttenderMastercs", postdata);
  }

  insertTechnicionMaster(postdata: any): Observable<any> {
    return this.http.post(this.url + "api/TechnicianMasters", postdata);

  }
  insertCustomerMasters(postdata: any): Observable<any> {
    return this.http.post(this.url + "api/CustomerMasters", postdata);
  }

  insertDynamicCode(cusid: any, noof: any) {
    return this.http.get<any>(this.url + "api/CustomerMasters/insertDynamicQRData?cusid=" + cusid + "&noof=" + noof).pipe((res) => {
      return res
    })
  }

  getCountry() {
    return this.http.get<any>("https://api.erpbakerybar.com/api/mCountries").pipe(map((res) => {
      return res
    }))
  }
  getAttenderMaster() {
    return this.http.get<any>(this.url + "api/AttenderMastercs/getAttenderMasterDetails").pipe(map((res) => {
      return res
    }))
  }
  getAttendercode() {
    return this.http.get<any>(this.url + "api/AttenderMastercs/getMaxAttendCode").pipe(map((res) => {
      return res
    }))
  }


  getTechnicianMaster() {
    return this.http.get<any>(this.url + "api/TechnicianMasters/getTechnicianMasterDetails").pipe((res) => {
      return res
    })
  }
  getTechnicianMaxCode() {
    return this.http.get<any>(this.url + "api/TechnicianMasters/getMaxTechCode").pipe((res) => {
      return res
    })
  }
  getCustomerMasters() {
    return this.http.get<any>(this.url + "api/CustomerMasters/getCustomerMasterDetails").pipe((res) => {
      return res
    })
  }
  getCustomerMaxCode() {
    return this.http.get<any>(this.url + "api/CustomerMasters/getMaxTechCode").pipe((res) => {
      return res
    })
  }
  deleteAttender(id: any) {
    // Define the URL with the id to be deleted
    const url = this.url + "api/AttenderMastercs/" + id;
    // Send an HTTP DELETE request to the specified URL
    return this.http.delete(url);
  }

  updateAttender(id: any, newData: any) {
    // Define the URL with the id to be updated
    const url = this.url + "api/AttenderMastercs/" + id;

    // Send an HTTP PUT request to the specified URL with the new data
    return this.http.put(url, newData);
  }

  deleteTechnician(id: any) {
    // Define the URL with the id to be deleted
    const url = this.url + "api/TechnicianMasters/" + id;
    // Send an HTTP DELETE request to the specified URL
    return this.http.delete(url);
  }


  deleteCustomer(id: any) {
    const url = this.url + "api/CustomerMasters/deleteCustomerData?id=" + id
    return this.http.get(url);
  }


  getQrCodeId() {
    return this.http.get<any>(this.url + "api/CustomerMasters/getQrCodes").pipe((res) => {
      return res
    })
  }


  EmpBasedQr(id: any) {
    return this.http.get<any>(this.url + "api/CustomerMasters/getQrCodeByCustomerId?id=" + id)
  }

  getCusNameMobie() {
    return this.http.get(this.url + "api/CustomerMasters/getCustomerNameAndMobile")
  }

  getDetailsBasedOnMobileNo(id: any) {
    return this.http.get(this.url + "api/CustomerMasters/GetDetailsBasedOnMobileNo?id=" + id)
  }

  DeleteCustomer(id: any) {
    return this.http.get(this.url + "api/CustomerMasters/DeleteCustomer?id=" + id)
  }

  CustomerEditList(id: any) {
    return this.http.get(this.url + "api/CustomerMasters/EditCustomer?id=" + id)
  }

  CustomerUpdate(id: any, obj: any) {
    return this.http.put(this.url + "api/CustomerMasters/UpdateCustomer" + id, obj)
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  MobileNumCheck(id: any) {
    return this.http.get(this.url + "api/CustomerProjectMasters/MobileNumCheck?id=" + id)
  }

  UserNameCheck(id: any) {
    return this.http.get(this.url + "api/CustomerProjectMasters/UserNameCheck?id=" + id)
  }

  updateIsActive(id:any,active:any){
    return this.http.get(this.url + "api/CustomerMasters/activeCustomer?id="+ id +"&active="+ active +"")

  }
}


