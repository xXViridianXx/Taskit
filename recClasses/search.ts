import {Activity} from './recClasses'

type scoreAndItem = {
  'score': number;
  'item': Activity;
}

export function filterList(searchQuery: string, data: scoreAndItem[]): scoreAndItem[] {
  return data.filter(item => item['item'].name.toLowerCase().includes(searchQuery.toLowerCase()));
}