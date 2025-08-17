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