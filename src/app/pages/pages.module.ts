import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormControl, Validator, FormGroup } from '@angular/forms';


import {
  NgbToastModule, NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { LightboxModule } from 'ngx-lightbox';

// Load Icons
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { WidgetModule } from '../shared/widget/widget.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomermasterComponent } from './customermaster/customermaster.component';
import { CustomermasterlistComponent } from './customermasterlist/customermasterlist.component';
import { QRCodeModule } from 'angularx-qrcode';
import { HomeComponent } from './home/home.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProjectMasterlistComponent } from './project-masterlist/project-masterlist.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import {MatTableModule} from '@angular/material/table';
import {PageEvent, MatPaginatorModule} from '@angular/material/paginator';
import { ApplicationmasterComponent } from './applicationmaster/applicationmaster.component';
import { QrcodegeneratorComponent } from './qrcodegenerator/qrcodegenerator.component';
import { QrcodegeneratorlistComponent } from './qrcodegeneratorlist/qrcodegeneratorlist.component';
import { ReportComponent } from './report/report.component';
import { ReportprojwiseComponent } from './reportprojwise/reportprojwise.component';
import { SuperBannerComponent } from './super-banner/super-banner.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    CustomermasterComponent, CustomermasterlistComponent, HomeComponent, ProjectMasterlistComponent, UserFormComponent, UserListComponent, ApplicationmasterComponent, QrcodegeneratorComponent, QrcodegeneratorlistComponent, ReportComponent, ReportprojwiseComponent, SuperBannerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    FlatpickrModule.forRoot(),
    CountUpModule,
    NgApexchartsModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    SlickCarouselModule,
    LightboxModule,
    DropzoneModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    NgSelectModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
