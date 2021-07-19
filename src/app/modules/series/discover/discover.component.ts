import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IShow} from '../../../models/show.interface';
import {MenuController} from '@ionic/angular';
import {ScraperService} from '../../../services/scraper.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscoverComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller;
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

  ngAfterViewInit() {
    this.scroller.el.addEventListener('scroll', this.debounce(() => {
      const scrollY = this.scroller.el.scrollHeight - this.scroller.el.scrollTop - this.scroller.el.getBoundingClientRect().height;
      if (scrollY < 200) {
        this.onScroll();
      }
    }, 300))
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

  debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  onScroll(): void {
    this.filters.page++
    this.scraperService.fetchTrendingSeries(this.filters)
      .subscribe(response => {
        response.subscribe(results => {
          this.shows.push(...results);
          console.log('', results)
        })
      })
  }

  applyFilters(event) {
    console.log('applyFilters', event)
    this.shows = []
    this.filters.platform = event.detail.value
    this.fetchTrending()
  }


}
