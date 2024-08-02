import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomermasterComponent } from './customermaster/customermaster.component';
import { CustomermasterlistComponent } from './customermasterlist/customermasterlist.component';
import { HomeComponent } from './home/home.component';
import { ProjectMasterlistComponent } from './project-masterlist/project-masterlist.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { ApplicationmasterComponent } from './applicationmaster/applicationmaster.component';
import { QrcodegeneratorComponent } from './qrcodegenerator/qrcodegenerator.component';
import { QrcodegeneratorlistComponent } from './qrcodegeneratorlist/qrcodegeneratorlist.component';
import { ReportComponent } from './report/report.component';
import { ReportprojwiseComponent } from './reportprojwise/reportprojwise.component';
import { SuperBannerComponent } from './super-banner/super-banner.component';

// Component pages
//import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";

const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: 'appmaster', component: ApplicationmasterComponent },  
  { path: 'customermaster', component: CustomermasterComponent },
  { path: 'customermasterlist', component: CustomermasterlistComponent },
  { path: 'qrmaster', component: QrcodegeneratorComponent },
  { path: 'qrmasterlist', component: QrcodegeneratorlistComponent  },
  { path: 'qrreport', component: ProjectMasterlistComponent  },
  { path: 'user', component: UserFormComponent },
  { path: 'userlist', component: UserListComponent },  
  { path: 'Report', component: ReportComponent }, 
  { path: 'Report-Projectwise', component: ReportprojwiseComponent }  ,
  { path: 'banner', component: SuperBannerComponent }  

  // ProjectMasterlistComponent


  // {
  //   path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  // },
  // {
  //   path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  // },
  // {
  //   path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
  // },
  // {
  //   path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
  // },
  // {
  //   path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
  // },
  // {
  //   path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)
  // },
  // {
  //   path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)
  // },
  // {
  //   path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
  // },
  // {
  //   path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
  // },
  // {
  //   path: 'pages', loadChildren: () => import('./extrapages/extraspages.module').then(m => m.ExtraspagesModule)
  // },
  // { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  // {
  //   path: 'advance-ui', loadChildren: () => import('./advance-ui/advance-ui.module').then(m => m.AdvanceUiModule)
  // },
  // {
  //   path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  // },
  // {
  //   path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
  // },
  // {
  //   path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
  // },
  // {
  //   path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
  // },
  // {
  //   path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  // },
  // {
  //   path: 'marletplace', loadChildren: () => import('./nft-marketplace/nft-marketplace.module').then(m => m.NftMarketplaceModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
