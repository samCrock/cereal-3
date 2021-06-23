import {IEpisode} from './episode.interface';

export interface ISeason {
  id: string,
  number: string,
  aired_at: string,
  episodes: IEpisode[]
}
