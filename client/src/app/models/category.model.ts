export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  items?: any[]; //wtf? Forgot what this was supposed to do... ¯\_(ツ)_/¯ - just ignore it
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetCategoriesResponse {
  statusCode: number;
  data: Category[];
  message?: string;
}

export interface CreateCategoryRequest { //sent as FormData
  Name: string;
  Description?: string;
  File: File;
}

export interface CategoryCreateResponse {
  statusCode: number;
  data: Category;
  message?: string;
}

export interface UpdateCategoryRequest { //sent as FormData
  id: number;
  Name?: string;
  Description?: string;
  File?: File;
}

export interface UpdateCategoryResponse {
  statusCode: number;
  data: Category;
  message: string;
}

export interface DeleteCategoryResponse {
  statusCode: number;
  message: string;
  details?: string;
}