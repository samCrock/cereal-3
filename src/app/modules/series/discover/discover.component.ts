import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IShow} from '../../../models/show.interface';
import {MenuController} from '@ionic/angular';
import {ScraperService} from '../../../services/scraper.service';
import {Observable, Subscription} from 'rxjs';
import {SearchService} from '../../../services/search.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscoverComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('scroller') scroller;
  public shows: IShow[];
  public filters = {
    page: 0,
    platform: ''
  }
  public searchResults: Observable<any>
  public showFilters = true
  public searchSub: Subscription

  constructor(
    private menu: MenuController,
    private scraperService: ScraperService,
    private searchService: SearchService
  ) {
  }

  async ngOnInit() {
    this.shows = await this.fetchTrending()
    this.searchSub = this.searchService.searchResults
      .subscribe(async results => {
        console.log(results)
        this.filters = {
          page: 0,
          platform: ''
        }
        this.shows = results
        this.showFilters = false
        if (!results.length) {
          this.shows = await this.fetchTrending()
          this.showFilters = true
        }
      })
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe()
  }

  ngAfterViewInit() {
    this.scroller?.el.addEventListener('scroll', this.debounce(() => {
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

  fetchTrending(): Promise<IShow[]> {
    return new Promise(resolve => {
      this.scraperService.fetchTrendingSeries(this.filters)
        .subscribe(response => {
          response.subscribe(results => {
            resolve(results)
            // this.cd.detectChanges()
          })
        })
    })
  }

  debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
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

  async applyFilters(event) {
    console.log('applyFilters', event)
    this.shows = []
    this.filters.platform = event.detail.value
    this.shows = await this.fetchTrending()
  }


}
