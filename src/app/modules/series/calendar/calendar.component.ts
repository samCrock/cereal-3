import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ScraperService} from '../../../services/scraper.service';
import * as moment from 'moment';
import {IonContent} from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  days: any[]
  page = 0
  @ViewChild(IonContent, {read: IonContent, static: false}) calendarContainer: IonContent;

  constructor(
    private scraperService: ScraperService
  ) {
  }

  ngOnInit() {
    this.scraperService.fetchCalendar()
      .subscribe(days => {
        this.days = days
        setTimeout(() => {
          const today = moment().format('DD-MMM')
          const todayContainer = document.getElementById(today)
          this.calendarContainer.scrollToPoint(0, todayContainer?.getBoundingClientRect().y - 15)
        }, 100)
      })
  }

  onScroll(event) {
    this.page++
    // this.scraperService.fetchTrendingSeries(this.filters)
    //   .subscribe(response => {
    //     response.subscribe(results => {
    //       this.shows.push(...results);
    //       console.log('', results)
    //     })
    //     event.target.complete()
    //   })
  }

}
