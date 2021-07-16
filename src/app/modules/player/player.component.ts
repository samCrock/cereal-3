import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ScraperService} from '../../services/scraper.service';
import {TorrentService} from '../../services/torrent.service';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent implements OnInit {

  private path
  private app
  private fs
  private shell
  player

  constructor(
    private scraperService: ScraperService,
    private torrentService: TorrentService,
    private router: Router,
    private electronService: ElectronService,
    private sanitizer: DomSanitizer
  ) {
    this.path = this.electronService.remote.getGlobal('path')
    this.app = this.electronService.remote.getGlobal('app')
    this.fs = this.electronService.remote.getGlobal('fs');
    this.shell = this.electronService.remote.getGlobal('shell');
  }

  ngOnInit() {
    this.player = document.getElementsByTagName('video')[0];


    let watching = localStorage.getItem('watching') as any
    watching = JSON.parse(watching)
    console.log('Watching', watching)
    this.scraperService.fetchEpisodeTorrents(watching)
      .subscribe(torrents => {
        console.log('Torrents', torrents)
        this.torrentService.addTorrent(torrents[0])
          .subscribe(torrent => {

            // const server = torrent.createServer()
            // server.listen(3333)

            console.log('torrent', torrent);

            const videoFile = torrent.files.find(file => {
              return file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.avi')
            })

            const filePath = this.path.join(torrent.path, videoFile.path);

            console.log('filePath', filePath)
            console.log('videoFile', videoFile)

            // video.controls = true
            // this.videoSrc = 'http://localhost:3333/' + 0
            // this.player.setAttribute('src', 'http://localhost:3333/' + 0);

            // this.videoJsPlayer.src = filePath
            // this.videoJsPlayer = videojs(this.player, {
            //   controls: true,
            //   sources: [{
            //     src: filePath,
            //     type: 'video/mkv'
            //   }]
            // }, function onPlayerReady() {
            //   console.log('onPlayerReady')
            // })
            // this.player.innerHTML = '<source src="' + filePath + '"></source>'
            console.log(this.shell)
            this.shell.openPath(filePath);

          })
      })
  }

  back() {
    window.history.back()
  }

}
