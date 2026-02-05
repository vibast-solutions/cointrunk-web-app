export interface ArticleProps {
  id: string;
  title: string;
  url: string;
  picture: string;
  publisher: string;
  paid: boolean;
  created_at: string;
}

export interface PublisherProps {
  name: string;
  address: string;
  active: boolean;
  articles_count: number;
  created_at: string;
  respect: string;
}

export interface AcceptedDomainProps {
  domain: string;
  active: boolean;
}

export interface CointrunkParamsProps {
  anon_article_limit: number | string;
  anon_article_cost: {
    amount: string;
    denom: string;
  };
  publisher_respect_params: {
    tax: string;
    denom: string;
  };
}
