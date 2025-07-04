import { useQuery } from '@tanstack/react-query';
import { getBooksByShelf } from '@/lib/api';
import { Book } from '@/lib/type';

export function useBooks(shelfId: string, offset: number = 0, limit: number = 20) {
    return useQuery<Book[]>({
      queryKey: ['books', shelfId, offset, limit], 
      queryFn: () => getBooksByShelf(shelfId, offset, limit),
      enabled: !!shelfId,
    });
  }
  