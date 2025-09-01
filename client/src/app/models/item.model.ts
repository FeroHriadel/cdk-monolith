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

export interface CreateItemRequest {
  Name: string;
  Description: string;
  CategoryId: string;
  TagIds: string[];
  Images: File | null;
}

export interface CreateItemResponse {
  data: Item;
  statusCode: number;
  message: string;
}

export interface UpdateItemRequest {
  Name?: string;
  Description?: string;
  CategoryId?: string;
  TagIds?: string[];
  Images?: File | null;
}

export interface UpdateItemResponse {
  data: Item;
  statusCode: number;
  message: string;
}
