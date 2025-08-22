export interface Item {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  tagIds: number[];
  tagNames: string[];
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetItemsQueryStringAsObject {
  [key: string]: string | number | boolean | undefined;
  pageSize?: number;
  page?: number;
  searchTerm?: string;
}

export interface GetItemsResponse {
  data: Item[];
  statusCode: number;
  message: string;
}

