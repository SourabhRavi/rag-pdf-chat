import AuthLayout from "@/layouts/AuthLayout";
import { LoginForm } from "../components/common/login-form";

const Login = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
