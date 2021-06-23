import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {IShow} from '../../../../models/show.interface';
import {Router} from '@angular/router';
import {ScraperService} from '../../../../services/scraper.service';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreviewCardComponent implements OnInit {

  @Input() show: IShow

  constructor(
    private router: Router,
    private scraperService: ScraperService
  ) {
  }

  async ngOnInit() {
    // console.log(this.show)
  }

  navigateShow() {
    this.router.navigate(['/series', this.show.id ])
  }

  async navigateFromCalendar() {
    const show = await this.scraperService.searchByName(this.show.title, 'Show').toPromise()
    console.log(show.id)
    this.router.navigate(['/series', show.id])
  }

}
