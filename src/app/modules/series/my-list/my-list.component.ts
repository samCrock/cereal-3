import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IShow} from '../../../models/show.interface';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyListComponent implements OnInit {

  public shows: IShow[];

  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.fetchMyList().then()
  }

  async fetchMyList() {
    this.shows = await this.dataService.fetchMyList()
    console.log('My List', this.shows)
    this.cd.detectChanges()
  }

}
