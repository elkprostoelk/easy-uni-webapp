export class TokenDto {
  expirationDate: Date = new Date();
  userId: string = '';
  email: string = '';
  roles: string[] = [];
}
