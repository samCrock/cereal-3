import {Observable} from 'rxjs';

export interface IShow {
  slug: string,
  title: string,
  id: string,
  overview: string,
  imdb_rating: string,
  released_on: string,
  season_count: string,
  poster: string
  currentSeason?: number;
  banner?: string;
}
