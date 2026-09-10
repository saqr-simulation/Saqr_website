import { AuthForm } from '../../../components/auth-form';
import { authConfig } from '../../../lib/env';
export const dynamic = 'force-dynamic';
export default function Register() {
  return <AuthForm mode="register" configured={Boolean(authConfig())} />;
}
