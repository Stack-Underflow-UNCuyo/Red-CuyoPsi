import { useState } from 'react';

export function useLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: call auth service once authentication is implemented
  };

  return { email, setEmail, password, setPassword, handleLogin };
}
