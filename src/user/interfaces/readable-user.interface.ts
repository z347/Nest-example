export interface IReadableUser {
  readonly email: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly gender: string;
  readonly searchField: string;
  readonly phone: string;
  readonly roles: string[];
  accessToken?: string;
}
