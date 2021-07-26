import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';
import {TorrentService} from '../../../services/torrent.service';
import {ElectronService} from 'ngx-electron';
import {ScraperService} from '../../../services/scraper.service';
import {DataService} from '../../../services/data.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-episode-card',
  templateUrl: './episode-card.component.html',
  styleUrls: ['./episode-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EpisodeCardComponent implements OnInit, OnDestroy {

  @Input() episode: any
  @Input() show: any
  @Input() isCurrentEpisode: boolean
  private path
  private app
  private fs
  private shell
  public torrent
  selected: boolean
  opened = false
  loading = false
  downloading = false
  progress = 0.0
  speed

  constructor(
    private torrentService: TorrentService,
    private electronService: ElectronService,
    private scraperService: ScraperService,
    private dataService: DataService,
    private cd: ChangeDetectorRef,
    public toastController: ToastController
  ) {
    this.path = this.electronService.remote.getGlobal('path')
    this.app = this.electronService.remote.getGlobal('app')
    this.fs = this.electronService.remote.getGlobal('fs');
    this.shell = this.electronService.remote.getGlobal('shell');
  }

  async ngOnInit() {
    const dbEpisode = await this.dataService.retrieveEpisode(this.episode.id)

    if (dbEpisode && dbEpisode['magnetURI']) {
      console.log('dbEpisode', dbEpisode)
      this.episode = dbEpisode
      this.progress = dbEpisode['progress']
      this.cd.detectChanges()

      const currentTorrent = this.torrentService.getTorrent(dbEpisode['magnetURI'])
      console.log('currentTorrent', currentTorrent)
      if (currentTorrent) {
        this.opened = true
        this.downloadEpisode(currentTorrent)
      }
    }
  }

  ngOnDestroy() {
    if (this.episode.magnetURI) {
      console.log('saveEpisode', this.episode)
      this.dataService.saveEpisode(this.episode)
    }
  }

  episodeIsAvailable(episode): boolean {
    return moment(episode.aired_at).diff(moment(), 'hours') < 12
  }

  playEpisode(ep) {
    console.log('playEpisode', this.episode);
    this.updateShowWithCurrentEpisode()
    ep.show_title = this.show.title
    this.loading = true

    if (this.episode.magnetURI) {
      this.downloadEpisode({
        dn: this.episode.dn,
        magnetURI: this.episode.magnetURI
      })
    } else {
      this.scraperService.fetchEpisodeTorrents(ep)
        .subscribe(async torrents => {
            console.log('Torrents', torrents)
            if (torrents.length) {
                this.downloadEpisode(torrents[0])
            } else {
                this.loading = false
                const toast = await this.toastController.create({
                    message: 'No torrents available for this episode',
                    duration: 5000
                });
                toast.present()
            }
        })
    }

  }

  handlePlayAction() {
    if (!this.loading) {
      this.opened = false
      this.playEpisode(this.episode)
    }
  }

  downloadEpisode(t) {
    console.log('downloadEpisode', t)

    this.torrentService.addTorrent(t)
      .subscribe(torrent => {
        torrent.magnetURI = t.magnet ? t.magnet : t.magnetURI
        this.torrent = torrent
        console.log('torrent', torrent);

        this.episode.magnetURI = torrent.magnetURI
        this.episode.progress = torrent.progress
        this.episode.dn = torrent.path.split('\\').pop()

        const videoFile = torrent.files.find(file => {
          return file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.avi')
        })

        const filePath = this.path.join(torrent.path, videoFile.path);

        console.log('filePath', filePath)
        console.log('videoFile', videoFile)
        console.log(this.opened)

        if ((videoFile.done && !this.opened) || (!videoFile.done && this.progress > .1 && !this.opened)) {
          this.shell.openPath(filePath);
          this.downloading = false
          this.loading = false
          this.opened = true
        }

        torrent.on('download', () => {
          // console.log('total downloaded: ' + torrent.downloaded)
          // console.log('download speed: ' + torrent.downloadSpeed)
          this.downloading = true

          this.episode.magnetURI = torrent.magnetURI
          this.episode.progress = torrent.progress

          this.speed = (Math.round((torrent.downloadSpeed / 1048576) * 100) / 100).toString();
          // this.progress = Math.round(Number((Math.abs(torrent.progress) * 100).toPrecision(15))) * Math.sign(torrent.progress)
          this.progress = torrent.progress
          // console.log(this.progress)
          if (this.progress > .05 && !this.opened) {
            this.shell.openPath(filePath);
            this.loading = false
            this.opened = true
          }
          this.cd.detectChanges()
        })

        torrent.on('done', () => {
          console.log('Torrent done')
          this.loading = false
          this.downloading = false
          this.speed = 0
          this.cd.detectChanges()
        })

        this.cd.detectChanges()


      })
  }

  deleteTorrent() {
    console.log('Deleting', this.episode)
    this.torrentService.deleteTorrent(this.episode.magnetURI)
      .subscribe(() => {
        delete this.episode.dn
        delete this.episode.magnetURI
        delete this.episode.progress
        delete this.progress
        delete this.speed
        this.loading = false
        this.cd.detectChanges()
        this.dataService.saveEpisode(this.episode)
      })

  }

  updateShowWithCurrentEpisode() {
    this.show.currentEpisode = this.episode.number
    this.show.poster = 'https://img.reelgood.com/content/show/' + this.show.id + '/poster-780.jpg'
    this.show.currentSeason = parseInt(this.episode.season_label.substr(1, this.episode.season_label.length), 10)
    this.dataService.saveShow(this.show)
  }


}
