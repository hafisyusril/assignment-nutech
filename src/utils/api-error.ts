export class ApiError extends Error {
  httpStatus: number;
  businessStatus: number;
  data: any;

  constructor(message: string, httpStatus: number, businessStatus: number, data: any = null) {
    super(message);
    this.httpStatus = httpStatus;
    this.businessStatus = businessStatus;
    this.data = data;
  }
}
