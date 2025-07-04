export interface ShelfUser {
    id: string;
    name: string;
    username: string;
    image: string;
  }
  
  export interface Shelf {
    id: string;
    slug: string;
    title: string;
    last_modified: number;
    user: ShelfUser;
  }


  export interface Book {
    id: string;
    title: string;
    authors?: ShelfUser;
    price?: number;
    averageRating?: number;
    cover: {
      url: string;
    };
  }