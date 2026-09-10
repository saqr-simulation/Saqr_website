import { AuthForm } from '../../../components/auth-form';
import { authConfig } from '../../../lib/env';
export const dynamic = 'force-dynamic';
export default function Login() {
  return <AuthForm mode="login" configured={Boolean(authConfig())} />;
}
