import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {from, Observable, of} from 'rxjs';
import {IShow} from '../models/show.interface';
import {ISeason} from '../models/season.interface';
import * as cheerio from 'cheerio'
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  eztvShowsList: Array<any>

  constructor(
    private httpClient: HttpClient,
  ) {
    this.fetchEZTVShowsList().subscribe(showsList => {
      this.eztvShowsList = showsList
    })
  }

  public fetchEZTVShowsList(): Observable<any> {
    return new Observable(observer => {
      const stored = sessionStorage.getItem('eztvShowsList')
      if (stored) {
        return observer.next(JSON.parse(stored))
      }
      const url = 'https://eztv.unblockit.li/js/search_shows2.js'
      return this.httpClient.get(url, {
        responseType: 'text' as 'json'
      }).subscribe(response => {
        response = response.toString().split('var data = ')[1]
        response = response.toString().split('$(document).ready(function()')[0]
        response = response.toString().trim().slice(0, response.toString().trim().length - 1)
        sessionStorage.setItem('eztvShowsList', response.toString())
        return observer.next(JSON.parse(<string>response))
      })
    })
  }

  public fetchTrendingSeries(filters): Observable<any> {
    let url;
    if (filters.platform) {
      url = 'https://api.reelgood.com/v3.0/content/browse/source/' + filters.platform + '?content_kind=show' +
        '&imdb_end=10&imdb_start=6&override_user_sources=true&' +
        'overriding_free=false&region=us&rg_end=100&rg_start=0&' +
        'skip=' + filters.page * 50 + '&sort=1&sources=' + filters.platform + '&take=50'
    } else {
      url = 'https://api.reelgood.com/v3.0/content/browse/filtered?availability=onAnySource&content_kind=show&hide_seen=false' +
        '&hide_tracked=false&hide_watchlisted=false&imdb_end=10&imdb_start=6&region=us&rg_end=100&rg_start=0&' +
        'skip=' + filters.page * 50 + '&sort=1&take=50'
    }

    console.log(url)
    return from(fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }))
      .pipe(map(response => {
        return from(response.json())
          .pipe(map(parsed => {
            const results: IShow[] = []
            parsed.results.map(result => {
              const show = {
                slug: result.slug,
                title: result.title,
                id: result.id,
                overview: result.overview,
                imdb_rating: result.imdb_rating,
                released_on: result.released_on,
                season_count: result.season_count,
                poster: 'https://img.reelgood.com/content/show/' + result.id + '/poster-780.jpg'
              }
              results.push(show)
              // this.data.saveShow(show)
            })
            return results;
          }))
      }));
  }

  public fetchSeriesSeason(showId, season): Observable<any> {
    const url = 'https://api.reelgood.com/v3.0/content/show/' + showId + '/season/' + season + '?availability=onAnySource&interaction=true&region=us'
    return from(fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }))
      .pipe(map(response => {
        return from(response.json())
          .pipe(map(fetchedSeason => {
            // console.log('Season', season, '->', fetchedSeason)
            return {
              id: fetchedSeason.season.id,
              showId: fetchedSeason.id,
              number: fetchedSeason.season.number,
              aired_at: fetchedSeason.season.aired_at,
              episodes: Object.keys(fetchedSeason.episodes).reverse().map(k => {
                const ep = fetchedSeason.episodes[k]
                return {
                  id: ep.id,
                  title: ep.title,
                  number: ep.number,
                  season_label: fetchedSeason.season.number < 10 ? 'S0' + fetchedSeason.season.number : 'S' + fetchedSeason.season.number,
                  episode_label: ep.number < 10 ? 'E0' + ep.number : 'E' + ep.number,
                  overview: ep.overview,
                  aired_at: ep.aired_at,
                  cover: ep.has_screenshot ? 'https://img.reelgood.com/content/show/' +
                    fetchedSeason.id + '/' + fetchedSeason.season.id + '/' + ep.id + '/screenshot-400.jpg' : ''
                }
              })
            } as ISeason;
          }))
      }));
  }

  public fetchEpisodeTorrents(watching): Observable<any> {
    // const url = 'https://eztv.unblockit.li/search/' + watching.show_title + '-' + watching.season_label + watching.episode_label
    let url = ''
    const eztvShowId = this.eztvShowsList.filter(s => s.text === watching.show_title)[0]?.id
    if (eztvShowId) {
      url = 'https://eztv.unblockit.li/search/?q1=' + watching.season_label + watching.episode_label +
        '&q2=' + eztvShowId + '&search=Search'
    } else {
      url = 'https://eztv.unblockit.li/search/' + watching.season_label + watching.episode_label + '-' +
        watching.show_title.replaceAll(' ', '-')
    }

    console.log('Search torrent for', url)

    return new Observable(observer => {
      return this.httpClient.get(url, {
        responseType: 'text' as 'json'
      }).subscribe(response => {
        const torrents = []
        // @ts-ignore
        const $ = cheerio.load(response, {_useHtmlParser2: true});
        const rows = $('tr.forum_header_border')
        rows.map((i, row) => {
          // @ts-ignore
          const dn = row.children[3].children[1].children[0].data
          // @ts-ignore
          const magnet = row.children[5].children[1].attribs.href
          // @ts-ignore
          const seeds = row.children[11].children && row.children[11].children[0]?.children ? // @ts-ignore
            row.children[11].children[0]?.children[0]?.data : '0'
          torrents.push({
            dn,
            magnetURI: magnet,
            seeds
          })
        })
        return observer.next(torrents
          .filter(t => t.dn.indexOf(watching.season_label + watching.episode_label) > -1)
          .sort((a, b) => (parseInt(b.seeds, 10) > parseInt(a.seeds, 10)) ? 1 :
            ((parseInt(a.seeds, 10) > parseInt(b.seeds, 10)) ? -1 : 0))
          .slice(0, 5))
      })

    })

  }

  searchByName(name, type: 'Show' | 'Movie'): Observable<any> {
    const url = 'https://api.reelgood.com/v3.0/content/search/typeahead?region=us&terms=' + name
    return this.httpClient.get(url, {
      responseType: 'text' as 'json'
    }).pipe(map(response => {
      let results = JSON.parse(<string>response)
      results = results.filter(r => r.content_type === type)
      return results[0]
    }))
  }

  fetchCalendar(): Observable<any> {
    const url = 'https://www.pogdesign.co.uk/cat/'
    return new Observable(observer => {
      return this.httpClient.get(url, {
        responseType: 'text' as 'json'
      }).subscribe(response => {
        const daysData = []
        // @ts-ignore
        const $ = cheerio.load(response, {_useHtmlParser2: true});
        const days = $('.week .day, .today')
        days.map((i, day) => {
          const dayData = []
          // @ts-ignore
          let mm = day.attribs.id.split('_')[2]
          if (mm.length < 2) {
            mm = '0' + mm
          }
          let dd = day.attribs.id.split('_')[1]
          if (dd.length < 2) {
            dd = '0' + dd
          }
          const yy = day.attribs.id.split('_')[3]
          // @ts-ignore
          const $day = cheerio.load(day, {_useHtmlParser2: true});

          const episodes = []

          // tslint:disable-next-line:no-shadowed-variable
          $day('.ep.info [data-episode]').map((i, d) => {
            // @ts-ignore
            const title = $day('.ep.info [data-episode]')[i].children[0].children[0].data
            // @ts-ignore
            const pogdesign_title = $day('.ep.info [data-episode]')[i].children[0].attribs.href.replace('-summary', '')
            // @ts-ignore
            const episode_label = $day('.ep.info [data-episode]')[i].children[2].children[0].data
            episodes.push({
              title,
              episode_label,
              banner: 'https://pogd.es/assets/sismall/' + pogdesign_title + '.jpg'
            })
          })

          const date = moment()
          date.set('date', parseInt(dd, 10))
          date.set('months', parseInt(mm, 10) - 1)
          const duration = moment.duration(date.diff(moment())).asDays();
          if (moment.duration(date.diff(moment())).asDays() < 1) {
            daysData.push({
              date,
              episodes
            })
          }
        })
        return observer.next(daysData.reverse())
      })
    })
  }

  searchSeries(searchString): Observable<any> {
    const url = 'https://api.reelgood.com/v3.0/content/search/typeahead?region=us&terms=' + searchString
    return new Observable(observer => {
      return this.httpClient.get(url, {
        responseType: 'text' as 'json'
      }).pipe(map(response => {
        const results = []
        if (typeof response === 'string') {
          JSON.parse(response)
            .filter(r => r.content_type === 'Show')
            .map(r => {
              if (r.has_poster) {
                r.poster = 'https://img.reelgood.com/content/show/' + r.id + '/poster-342.jpg'
              }
              results.push(r)
            })
        }
        return results
      })).subscribe(res => {
        return observer.next(res)
      })
    })
  }

  fetchSeriesById(seriesId): Observable<any> {
    const url = 'https://api.reelgood.com/v3.0/content/show/' + seriesId + '?availability=onAnySource&interaction=true&region=us'
    return new Observable(observer => {
      return this.httpClient.get(url, {
        responseType: 'text' as 'json'
      }).subscribe(res => {
        return observer.next(JSON.parse(<string>res))
      })
    })
  }

  public fetchTrailerLink(title): Observable<any> {
    const url = 'https://www.youtube.com/results?search_query=' + title + '+trailer'
    return from(fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }))
      .pipe(map(response => {
          return from(response.json())
            .pipe(map(fetchedSeason => {
                // @ts-ignore
                const $ = cheerio.load(response, {_useHtmlParser2: true});
                const link = $('#video-title')
                console.log(link)
                return link
              })
            )
        })
      )
  }


}



