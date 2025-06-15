export class UserProfileDto {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  middleName: string | null = null;
  birthDate: string = '';
  phoneNumber: string = '';
  gender: number = 0;
}
