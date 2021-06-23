import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Observable} from 'rxjs';
import {isObservable} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {

  public wtClient
  public app
  public path

  constructor(
    private electronService: ElectronService
  ) {
    this.wtClient = this.electronService.remote.getGlobal('wt')
    this.app = this.electronService.remote.getGlobal('app');
    this.path = this.electronService.remote.getGlobal('path');
  }

  addTorrent(t): Observable<any> {
    return new Observable(observer => {
      const foundTorrent = this.wtClient.get(t.magnetURI)
      console.log('foundTorrent', foundTorrent)

      if (foundTorrent) {
        return observer.next(foundTorrent)
      } else {
        console.log('t', t)

        const filePath = t.dn ? this.path.join(this.app.getPath('downloads'), 'Cereal', t.dn) :
          this.path.join(t.path.split('\\').pop());
        this.wtClient.add(t.magnetURI, {
          path: filePath
        }, torrent => {
          return observer.next(torrent)
        })
      }
    })
  }

  deleteTorrent(magnetURI) {
    return new Observable(observer => {
      const t = this.wtClient.get(magnetURI)
      if (!t) {
        return observer.next(false)
      }
      t.destroy({
        destroyStore: true
      }, () => {
        return observer.next(true)
      })
    })
  }

  getTorrent(magnetURI): Observable<any> {
    return this.wtClient.get(magnetURI)
  }


}
