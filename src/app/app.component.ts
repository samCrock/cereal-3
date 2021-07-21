import {Component, OnInit, ViewEncapsulation} from '@angular/core'

import {MenuController, NavController, Platform, ToastController} from '@ionic/angular'
import {SplashScreen} from '@ionic-native/splash-screen/ngx'
import {StatusBar} from '@ionic-native/status-bar/ngx'
import {DataService} from './data.service'
import {ElectronService} from 'ngx-electron';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {filter} from 'rxjs/operators';
import {ScraperService} from './services/scraper.service';
import {SearchService} from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  private update = this.electronService.remote.getGlobal('update');
  private remoteVersion = this.electronService.remote.getGlobal('remoteVersion');
  public updateProgress: number;
  public updateReady: boolean;
  public fs = this.electronService.remote.getGlobal('fs');
  public app = this.electronService.remote.getGlobal('app');
  public shell = this.electronService.remote.getGlobal('shell');
  public path = this.electronService.remote.getGlobal('path');
  public browserWindow = this.electronService.remote.getGlobal('browserWindow');
  public exec = this.electronService.remote.getGlobal('exec');

  currentRoute = ''
  seriesRoutes = ['discover', 'calendar', 'my-list']
  public searchString = ''
  public searched: boolean

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataService,
    private router: Router,
    private electronService: ElectronService,
    private http: HttpClient,
    public toastController: ToastController,
    private menu: MenuController,
    private scraperService: ScraperService,
    private navController: NavController,
    private searchService: SearchService
  ) {
    this.initializeApp()

    this.currentRoute = this.router.url.split('/').pop()
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((val) => {
        if (val instanceof RouterEvent) {
          this.currentRoute = val.url.split('/').pop()
          if (this.currentRoute !== 'discover') {
            this.searched = false
          }
          if (val instanceof RouterEvent && val.url.split('/').length > 2 &&
            this.seriesRoutes.indexOf(val.url.split('/')[2]) === -1) {
            this.currentRoute = ''
          }
        }

      })

    this.searchService.searchResults.subscribe(searchResults => {
      this.searched = !!searchResults.length
    })

    // console.log(this.electronService.ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
    //
    // this.electronService.ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg) // prints "pong"
    // })
    // this.electronService.ipcRenderer.send('asynchronous-message', 'ping')

  }

  async ngOnInit() {
    if (this.update) {
      console.log('A new version is ready to download..');
      const startDownloadToast = await this.toastController.create({
        message: 'Downloading update',
        duration: 5000
      });
      startDownloadToast.present()
      this.http.get('https://github.com/samCrock/cereal-3/raw/win-build/Cereal Setup ' + this.remoteVersion + '.exe',
        {responseType: 'arraybuffer', reportProgress: true, observe: 'events'})
        .subscribe(async (event: any) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.updateProgress = Math.round(event['loaded'] / event['total'] * 100);
          }
          if (event.body) {
            console.log(event)
            const installerPath = this.path.join(this.app.getPath('downloads'), 'Cereal Setup ' + this.remoteVersion + '.exe');

            const buffer = new Buffer(event.body)
            this.fs.writeFile(installerPath, buffer, {}, async (err, res) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('File is ready:', installerPath);

              const that = this
              const finishedDownloadToast = await this.toastController.create({
                message: 'A new version is available',
                duration: 0,
                buttons: [
                  {
                    text: 'Install',
                    role: 'cancel',
                    handler() {
                      that.exec(that.path.join(that.app.getPath('downloads'), 'Cereal Setup ' + that.remoteVersion + '.exe'),
                        (e, data) => {
                          that.app.exit(0)
                        })
                    }
                  }
                ]
              })
              finishedDownloadToast.present()
            })
            this.updateReady = true;
            delete this.updateProgress;
          }
        });
    }

    setTimeout(() => {
      this.currentRoute = this.router.url.split('/').pop()
      console.log('currentRoute', this.currentRoute)
    }, 1000)
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.statusBar.styleLightContent()
        this.splashScreen.hide()
      }

      // this.router.navigate(['series'])

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

  minimize() {
    this.browserWindow.getFocusedWindow().minimize()
  }

  close() {
    this.app.exit(0)
  }

  async toggleMenu() {
    if (await this.menu.isOpen()) {
      this.menu.enable(false, 'first')
      this.menu.close('first')
    } else {
      this.menu.enable(true, 'first')
      this.menu.open('first')
    }
  }


  search() {
    if (this.searchString) {
      this.searchService.searchSeries(this.searchString).subscribe(() => {
        this.router.navigate(['/series', 'discover'])
      })
    } else {
      this.searchService.searchResults.next([])
      this.router.navigate(['/series', 'discover'])
    }
  }

  navigateTo(route) {
    this.navController.navigateRoot(route)
  }


}
