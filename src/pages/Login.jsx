// LoginPage.jsx
import { useAuth } from '../AuthContext';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // Dummy user data
    login({ username: 'testuser', token: 'dummytoken' });
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Login
