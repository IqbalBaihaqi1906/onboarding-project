export interface BaseResponseDto {
  success: boolean;
  code: number;
  data: object | any[] | null;
  error: {
    message: string;
    details: object | null;
  } | null;
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  } | null;
}
