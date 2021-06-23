import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IShow} from '../../../models/show.interface';
import {MenuController} from '@ionic/angular';
import {ScraperService} from '../../../services/scraper.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscoverComponent implements OnInit {

  public shows: IShow[];
  public searchString = ''
  public filters = {
    page: 0,
    platform: ''
  }

  constructor(
    private menu: MenuController,
    private scraperService: ScraperService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.fetchTrending()
  }

  toggleMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  search() {
    console.log(this.searchString)
    if (this.searchString) {
      // this.filters = {
      //   page: 0,
      //   platform: ''
      // }
      this.scraperService.searchSeries(this.searchString)
        .subscribe(response => {
          this.shows = response
          this.cd.detectChanges()
        })
    } else {
      this.fetchTrending()
    }
  }

  fetchTrending() {
    this.scraperService.fetchTrendingSeries(this.filters)
      .subscribe(response => {
        response.subscribe(results => {
          this.shows = results;
          this.cd.detectChanges()
        })
      })
  }

  onScroll(event) {
    this.filters.page++
    this.scraperService.fetchTrendingSeries(this.filters)
      .subscribe(response => {
        response.subscribe(results => {
          this.shows.push(...results);
          console.log('', results)
        })
        event.target.complete()
      })
  }

  applyFilters(event) {
    console.log('applyFilters', event)
    this.shows = []
    this.filters.platform = event.detail.value
    this.fetchTrending()
  }


}
