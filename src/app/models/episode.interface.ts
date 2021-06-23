export interface IEpisode {
  id: string,
  title: string,
  season_label: string;
  episode_label: string;
  number: string,
  overview: string,
  aired_at: string,
  cover?: string,
  dn?: string;
  magnetURI?: string,
  progress?: string,
}
