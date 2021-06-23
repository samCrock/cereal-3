import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment'


@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const diff = moment(value).diff(moment(), 'hours') / 24
      if (diff === 0) {
        return 'Today'
      }
      return moment(value).fromNow()
    }
  }

}
