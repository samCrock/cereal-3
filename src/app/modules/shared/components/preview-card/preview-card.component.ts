import {ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {IShow} from '../../../../models/show.interface';
import {Router} from '@angular/router';
import {ScraperService} from '../../../../services/scraper.service';
import {DataService} from '../../../../services/data.service';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreviewCardComponent implements OnInit {

  @Input() show: IShow
  isWatching: boolean
  bkg: string

  constructor(
    private router: Router,
    private scraperService: ScraperService,
    private dataService: DataService,
    private cd: ChangeDetectorRef
  ) {

  }

  async ngOnInit() {
    const img = new Image()
    img.onload = () => {
      this.bkg = this.show.banner ? this.show.banner : this.show.poster
      this.cd.detectChanges()
    }
    img.onerror = () => {
      this.bkg = null
      this.cd.detectChanges()
    }
    img.src = this.show.banner ? this.show.banner : this.show.poster
    this.isWatching = await this.dataService.isWatching(this.show.id)
  }

  navigateShow() {
    this.router.navigate(['/series', this.show.id])
  }

  async navigateFromCalendar() {
    const show = await this.scraperService.searchByName(this.show.title, 'Show').toPromise()
    console.log(show.id)
    this.router.navigate(['/series', show.id])
  }

}
