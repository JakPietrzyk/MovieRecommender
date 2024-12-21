interface ProductionCompanies {
  id: number,
  name: string,
  logo_path: string,
  origin_country: string
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average?: number;
    budget?: number;
    production_companies?: Array<ProductionCompanies>;
    popularity?: number;
    vote_count?: number;
    runtime?: number;
  }
