import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReportService } from '../Service/report.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SuperBannerService } from '../Service/super-banner.service';

@Component({
  selector: 'app-super-banner',
  templateUrl: './super-banner.component.html',
  styleUrls: ['./super-banner.component.scss']
})
export class SuperBannerComponent {
  GForm!: FormGroup;
  UrlQrId: any;
  constructor(public fb: FormBuilder, public ReportServ: ReportService, private superBannerService:SuperBannerService,
    public ngxLoader: NgxUiLoaderService,) {
    this.GForm = this.fb.group({
      branch: ['', [Validators.required]],
      files: ['', [Validators.required]],
    });
  }
  file: any = "";
  filePreview: any = '../../../../assets/no-images.png';
  fileurl: string = '';
  apiUrl = environment.url;
  UserId: any;
  baseUrl: any = environment.baseUrl;
  ngOnInit(): void {
    this.UserId = localStorage.getItem("UserId");
    this.GetBanner();
  }


  ngBanner: any;
  async onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      if (selectedFile.type.startsWith('image/')) {
        this.file = selectedFile;
        const base64Image = await this.convertImageToBase64(selectedFile);
        this.ngBanner = base64Image;
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreview = reader.result;
        };
        reader.readAsDataURL(this.file);
      } else {
        Swal.fire({
          title: 'Please Select Type Image Only',
          icon: 'warning',
        });
      }
    }
  }

  async convertImageToBase64(imageFile: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(imageFile);
    });
  }


  getUrlpath() {
    this.ngxLoader.start();
    return new Promise((resolve) => {
      // const formData: FormData = new FormData();
      // formData.append('file', this.file);
      var obj = {
        fileUrl: this.ngBanner,
        // UserCode: this.UserId ?? ''
      }
      if (this.file) {
        this.superBannerService.UploadBannerImage(obj).subscribe((res:any) => {
          this.fileurl = res.url;
          if (this.fileurl != '') {
            this.GetBanner();
            resolve('ok');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            resolve('error');
          }
        });
      }
      this.ngxLoader.stop();
    });
  }


  Bannerurl: any;
  GetBanner() {
    this.ngxLoader.start();
    this.superBannerService.GetBanner().subscribe((res: any) => {

      console.log(res, "banner");
      this.Bannerurl = this.baseUrl + res[0].fileUrl;
    })
    this.ngxLoader.stop();
  }
}
