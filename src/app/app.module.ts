import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {RouteReuseStrategy} from '@angular/router'

import {IonicModule, IonicRouteStrategy} from '@ionic/angular'
import {SplashScreen} from '@ionic-native/splash-screen/ngx'
import {StatusBar} from '@ionic-native/status-bar/ngx'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CustomInterceptor} from './interceptor';
import {CommonModule} from '@angular/common';
import {ElectronService} from 'ngx-electron';
import {NgxElectronModule} from 'ngx-electron';
import {SharedModule} from './modules/shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxElectronModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    ElectronService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    },
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
