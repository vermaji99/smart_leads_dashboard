class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T;
  public meta: any;

  constructor(statusCode: number, data: T, message = 'Success', meta = {}) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export default ApiResponse;
