import {Component, OnInit} from '@angular/core'

import {Platform, ToastController} from '@ionic/angular'
import {SplashScreen} from '@ionic-native/splash-screen/ngx'
import {StatusBar} from '@ionic-native/status-bar/ngx'
import {DataService} from './data.service'
import {ElectronService} from 'ngx-electron';
import {Router} from '@angular/router';
import {HttpClient, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  private update = this.electronService.remote.getGlobal('update');
  public updateProgress: number;
  public updateReady: boolean;
  public fs = this.electronService.remote.getGlobal('fs');
  public app = this.electronService.remote.getGlobal('app');
  public path = this.electronService.remote.getGlobal('path');

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataService,
    private router: Router,
    private electronService: ElectronService,
    private http: HttpClient,
    public toastController: ToastController
  ) {
    this.initializeApp()

    // console.log(this.electronService.ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
    //
    // this.electronService.ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg) // prints "pong"
    // })
    // this.electronService.ipcRenderer.send('asynchronous-message', 'ping')

  }

  ngOnInit() {
    if (this.update) {
      console.log('A new version is ready to download..');
      this.http.get('https://github.com/samCrock/cereal-3/raw/win-build/Cereal.exe',
        { responseType: 'arraybuffer', reportProgress: true, observe: 'events' }).subscribe(async (event: any) => {
        if (event.type === HttpEventType.DownloadProgress) {
          this.updateProgress = Math.round(event['loaded'] / event['total'] * 100);
        }
        if (event.body) {
          const installerPath = this.path.join(this.app.getPath('downloads'), 'Cereal.exe');
          console.log('File is ready:', installerPath);

          const toast = await this.toastController.create({
            message: 'A new version is available here:' + installerPath,
            duration: 5000
          });
          toast.present();

          this.fs.appendFileSync(installerPath, Buffer.from(event.body));

          this.updateReady = true;
          delete this.updateProgress;
        }
      });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.statusBar.styleLightContent()
        this.splashScreen.hide()
      }

      this.router.navigate(['series']) // TODO remove when movies section is ready

      this.data.setup()
        .then(info => {
          console.log('Database setup complete')
          this.data.retrieveShows()
            .then(res => {
              console.log('DB', res)
            })
        })
        .catch(error => console.log('Error setting up the Database: ', error))
    })
  }
}
