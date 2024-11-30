export interface Investment {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  minInvestment: number;
  targetReturn: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
  imageUrl: string;
}

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  trackRecord: string;
  assetsUnderManagement: string;
  logoUrl: string;
  location: string;
}