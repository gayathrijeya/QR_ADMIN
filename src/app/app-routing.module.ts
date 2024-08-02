import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule
} from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#FFD700',
  bgsOpacity: 1,
  fastFadeOut: true,
  fgsColor: '#FFD700',
  pbColor: '#FFD700',
  fgsType: "cube-grid",
  logoPosition: "center-center",
  logoSize: 100,
  logoUrl: "assets/images/max.png",
  overlayColor: "rgba(133,132,132,0.8)"
};
const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),canActivate:[AuthGuard]},
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
