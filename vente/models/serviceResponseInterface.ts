interface IResult {
  url: string;
  status: number | null;
  error: string | null;
}

interface IVerifResponse {
  success: boolean;
  errors: IResult[] | null;
}

interface IUpdateResponse {
  success: boolean;
  message: string;
  data?: any;
}

export { IResult, IVerifResponse, IUpdateResponse };
