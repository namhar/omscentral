import { AuthProvider, Role } from '../enums';
import { User } from '../models';

const unknownUser: User = new User();

unknownUser.id = 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6';
unknownUser.auth_provider = AuthProvider.Password;
unknownUser.pricing_tier = null;
unknownUser.name = 'Unknown';
unknownUser.role = Role.Basic;
unknownUser.anonymous = false;

export { unknownUser };
