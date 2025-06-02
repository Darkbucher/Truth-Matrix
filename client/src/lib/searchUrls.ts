// utils/searchUrls.ts
export const getSearchUrl = (sourceName: string, query: string): string => {
  const encodedQuery = encodeURIComponent(query);
  switch (sourceName) {
    case 'Google Scholar':
      return `https://scholar.google.com/scholar?q=${encodedQuery}`;
    case 'JSTOR':
      return `https://www.jstor.org/action/doBasicSearch?Query=${encodedQuery}`;
    case 'PubMed':
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodedQuery}`;
    case 'Reuters':
      return `https://www.reuters.com/search/news?blob=${encodedQuery}`;
    case 'AP News':
      return `https://apnews.com/search?query=${encodedQuery}`;
    case 'BBC News':
      return `https://www.bbc.co.uk/search?q=${encodedQuery}`;
    case 'Snopes':
      return `https://www.snopes.com/search/?q=${encodedQuery}`;
    case 'FactCheck.org':
      return `https://www.factcheck.org/search/?q=${encodedQuery}`;
    case 'PolitiFact':
      return `https://www.politifact.com/search/?q=${encodedQuery}`;
    case 'Nature':
      return `https://www.nature.com/search?q=${encodedQuery}`;
    case 'Science.org':
      return `https://www.science.org/search?search_api_fulltext=${encodedQuery}`;
    case 'arXiv':
      return `https://arxiv.org/search/?query=${encodedQuery}&searchtype=all`;
    default:
      return '#';
  }
};