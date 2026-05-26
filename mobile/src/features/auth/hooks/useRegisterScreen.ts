import { useState } from 'react';

export function useRegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // TODO: call auth service once authentication is implemented
  };

  return { name, setName, email, setEmail, phone, setPhone, password, setPassword, handleRegister };
}
