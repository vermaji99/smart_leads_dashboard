export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales User';
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPaginationMeta;
}
