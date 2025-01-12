import type { Tables } from "@/integrations/supabase/types";

export const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
};

export const sortSponsors = (sponsors: Tables<'sponsors'>[], sortBy: string) => {
  const sortedSponsors = [...sponsors];
  
  switch (sortBy) {
    case "nameAsc":
      return sortedSponsors.sort((a, b) => a.name.localeCompare(b.name));
    case "nameDesc":
      return sortedSponsors.sort((a, b) => b.name.localeCompare(a.name));
    case "returnsDesc":
      return sortedSponsors.sort((a, b) => {
        const getNumericReturn = (returns: string | null) => {
          if (!returns) return 0;
          const match = returns.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        return getNumericReturn(b.advertised_returns) - getNumericReturn(a.advertised_returns);
      });
    case "default":
    default:
      const weekNumber = getWeekNumber();
      return sortedSponsors.sort((a, b) => {
        const hashA = (a.id + weekNumber.toString()).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = (b.id + weekNumber.toString()).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hashA - hashB;
      });
  }
};