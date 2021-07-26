import {Injectable} from '@angular/core'
import {Platform} from '@ionic/angular'
import {ElectronService} from '../electron.service'
import {EventService} from '../events.service'
import * as PouchDB from 'pouchdb/dist/pouchdb'
import SecurePouch from 'polyonic-secure-pouch'
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite'
import * as moment from 'moment';
import {IShow} from '../models/show.interface';
import {IEpisode} from '../models/episode.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public db: any
  public dbInfo: any

  constructor(
    public electron: ElectronService,
    private events: EventService,
    private platform: Platform
  ) {
  }

  public setup() {
    const ctx = this
    console.log('Setting up the application database')
    return new Promise<void>((resolve, reject) => {
      ctx.platform.ready()
        .then(() => {
          PouchDB.plugin(SecurePouch)
          return ctx.db = new PouchDB('app.db')

        })
        .then(res => {
          ctx.db.encrypt('password') // <<<<<<<<<<<<< Replace with your secret key
          return ctx.db.info()
        })
        .then(info => {
          ctx.events.publish('database:available', info)
          resolve()
        })
        .catch(error => {
          console.log('Error waiting for platform to load', error)
          reject(error)
        })
    })
  }

  public async saveShow(show: IShow) {
    show['_id'] = show.id;
    show['_updated'] = new Date();
    const dbShow = await this.retrieveShow(show.id)
    if (dbShow) {
      show['_rev'] = dbShow._rev
    }
    this.db.put(show, function callback(err, result) {
      if (!err) {
        console.log('Successfully saved a show!', result);
      } else {
        console.log('Error saving a show', err);
      }
    });
  }

  public async saveEpisode(episode: IEpisode) {
    let currentEp = await this.retrieveEpisode(episode.id)
    if (!currentEp) {
      // @ts-ignore
      currentEp = episode
      currentEp['_id'] = episode.id
    }
    currentEp['magnetURI'] = episode.magnetURI
    currentEp['progress'] = episode.progress

    console.log('currentEp', currentEp)
    console.log('episode', episode)

    this.db.put(currentEp, function callback(err, result) {
      if (!err) {
        console.log('Successfully saved an episode!');
      } else {
        console.error(err);
      }
    });
  }

  public retrieveEpisode(episodeId): Observable<any> {
    return this.db.get(episodeId)
      .then(doc => {
        // console.log('Episode found')
        const duration = moment.duration(moment().diff(moment(doc._updated)));
        const hours = duration.asHours();
        // console.log('Last updated', hours, 'hours ago')
        return doc
      })
      .catch(err => {
        if (err.name === 'not_found') {
          // console.log('Episode not in db, fetching..')
        } else {
          throw err;
        }
      })
  }


  public retrieveShows() {
    const ctx = this
    return ctx.db.allDocs({include_docs: true})
      .then(docs => {
        docs.rows.map(row => {
          row.doc.Date = new Date(row.doc.Date);
          return row.doc;
        });
        return docs.rows;
      });
  }

  public fetchMyList() {
    return this.db.allDocs({include_docs: true})
      .then(docs => {
        return docs.rows
          .filter(row => row.doc.currentEpisode)
          .sort((a, b) => {
            if (a.doc._updated > b.doc._updated) { return -1 }
            if (a.doc._updated < b.doc._updated) { return 1 }
            return 0
          })
          .map(row => {
            return row.doc
          })
      });
  }

  public retrieveShow(showId) {
    return this.db.get(showId)
      .then(function (doc) {
        // console.log('Show found')
        const duration = moment.duration(moment().diff(moment(doc._updated)));
        const hours = duration.asHours();
        // console.log('Last updated', hours, 'hours ago')
        return doc
      })
      .catch(function (err) {
        if (err.name === 'not_found') {
          console.log('Show not in db, fetching..')
        } else {
          throw err;
        }
      })
  }

  public async isWatching(showId) {
    return await this.db.get(showId)
      .then(function (doc) {
        return true
      })
      .catch(function (err) {
        return false
      })
  }


}
