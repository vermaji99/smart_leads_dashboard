export type IUser = {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales User';
}

export type IPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type IApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPaginationMeta;
}
