import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ScraperService} from './scraper.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchResults: BehaviorSubject<any[]> = new BehaviorSubject([])
  public searchFilters: Subject<any> = new Subject<any>()

  constructor(
    private scraperService: ScraperService
  ) {
    this.searchFilters.next( {
        page: 0,
        platform: ''
    })
  }

  public searchSeries(searchString) {
    return this.scraperService.searchSeries(searchString)
      .pipe(map(results => {
        this.searchResults.next(results)
      }))
  }


}
