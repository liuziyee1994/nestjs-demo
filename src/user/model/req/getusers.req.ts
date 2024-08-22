export interface GetUsersReq {
  page: number;
  limit?: number;
  username?: string;
  role?: number;
  gender?: number;
}