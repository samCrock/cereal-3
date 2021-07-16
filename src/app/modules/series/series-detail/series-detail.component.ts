import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ScraperService} from '../../../services/scraper.service';
import {IShow} from '../../../models/show.interface';
import {ISeason} from '../../../models/season.interface';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SeriesDetailComponent implements OnInit {

  public show: IShow
  public season: ISeason
  public currentSeason = 1
  public currentEpisode = 1
  public seasonsArray = []

  constructor(
    private activeRoute: ActivatedRoute,
    private data: DataService,
    private scraperService: ScraperService,
    private router: Router
  ) {

    this.activeRoute.params.subscribe(async params => {
      if (params['id']) {
        const dbShow = await this.data.retrieveShow(params['id'])
          if (dbShow) {
            this.currentSeason = dbShow.currentSeason ? dbShow.currentSeason : this.currentSeason
            this.currentEpisode = dbShow.currentEpisode ? dbShow.currentEpisode : this.currentEpisode
            console.log('currentEpisode', this.currentEpisode)
          }
        this.scraperService.fetchSeriesById(params['id'])
          .subscribe(async show => {
            console.log('Show', show)
            this.show = show
            this.show.poster = 'https://img.reelgood.com/content/show/' + show.id + '/poster-780.jpg'
            this.seasonsArray = new Array(show.season_count)
            this.fetchSeason()
          })
      }
    })

  }

  ngOnInit() {
  }

  fetchSeason() {
    // this.show.currentSeason = this.currentSeason
    // this.data.saveShow(this.show)
    this.scraperService.fetchSeriesSeason(this.show.id, this.currentSeason)
      .subscribe(async response => {
        await response.subscribe(season => {
          console.log('Season', season);
          this.season = season
          if (this.currentEpisode) {
            setTimeout(() => {
              const currentEpisodeCard = document.getElementById('episode-' + this.currentEpisode)
              const seasonRow = document.getElementById(this.season.id)
              console.log('Scroll to currentEpisode', currentEpisodeCard.getBoundingClientRect().y)
              seasonRow.scrollTo({
                top: currentEpisodeCard.getBoundingClientRect().y - 420,
                // left: currentEpisodeCard.getBoundingClientRect().x - 28,
                left: 0,
                behavior: 'auto'
              })
            })
          }
        })
      })
  }

  scrollSeason(seasonId, forward) {
    const seasonRow = document.getElementById(seasonId)
    const factor = forward ? 1 : -1;
    seasonRow.scrollTo({
      left: 0,
      top: seasonRow.scrollTop + factor * (140 + 24) * 2,
      behavior: 'smooth'
    })
  }

  back() {
    window.history.back()
  }


}
