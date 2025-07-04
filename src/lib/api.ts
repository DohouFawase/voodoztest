import api from '@/config/config'



export const fetchShelves = async ()=> {
    try {
        const { data } = await api.get('users/5a8411b53ed02c04187ff02a/shelves')
          console.log(data);
          return data
     
        } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error)
      throw new Error('Erreur lors de la récupération des données')
    }
  }






  export const fetchFormDetails = async (formId: string) => {
    try {
      const { data } = await api.get(`/forms/${formId}`);
      console.log('Détails du form:', data);
      // Mapper les données de l'API vers notre interface Book
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw new Error('Erreur lors de la récupération des détails du livre');
    }
  };



  // src/lib/api.ts
import { Book } from './type';

// export async function getBooksByShelf(shelfId: string,
//   offset: number = 0, 
//   limit: number = 20): Promise<Book[]> {
//   try {
//     const formIdsRes = await api.get<{ formIds: string[] }>(`/shelves/${shelfId}/forms`);
//     const formIds = formIdsRes.data;

//     // 🔁 Récupérer tous les livres via Promise.all
//     const books = await Promise.all(
//       formIds.map(async (formId: string) => {
//         const bookRes = await api.get<Book>(`/forms/${formId}`);
//         return bookRes.data;
//       })
//     );

//     return books;
//   } catch (err) {
//     console.error('Erreur récupération des livres :', err);
//     throw new Error('Impossible de charger les livres');
//   }
// }



export async function getBooksByShelf(
  shelfId: string,
  offset: number = 0,
  limit: number = 20
): Promise<Book[]> {
  try {
    // 1. Récupérer TOUS les IDs de formulaires (livres) pour l'étagère
    // L'API /shelves/:shelfId/forms ne semble pas supporter offset/limit.
    // Donc, nous récupérons tous les IDs, puis nous paginons côté client.
    const formIdsRes = await api.get<string[]>(`/shelves/${shelfId}/forms`);
    const allFormIds: string[] = formIdsRes.data; // Supposons que l'API retourne directement string[]

    // 2. Appliquer la pagination (offset et limit) sur les IDs récupérés
    const paginatedFormIds = allFormIds.slice(offset, offset + limit);

    // 3. Récupérer les détails des livres pour les IDs paginés via Promise.all
    const books = await Promise.all(
      paginatedFormIds.map(async (formId: string) => {
        const bookRes = await api.get<Book>(`/forms/${formId}`);
        return bookRes.data;
      })
    );

    return books;
  } catch (err) {
    console.error('Erreur récupération des livres :', err);
    throw new Error('Impossible de charger les livres');
  }
}