export interface Tag {
  id: number;
  name: string;
  createdBy: Date;
  createdAt: Date;
}

export interface GetTagsResponse {
  statusCode: number;
  message: string;
  data: Tag[];
}

export interface CreateTagRequest {
  name: string;
}

export interface CreateTagResponse {
  statusCode: number;
  message: string;
  data: Tag;
}

export interface UpdateTagRequest {
  name: string;
  id: number;
}

export interface UpdateTagResponse {
  statusCode: number;
  message: string;
  data: Tag;
}

export interface DeleteTagResponse {
  statusCode: number;
  message: string;
  details?: string;
}