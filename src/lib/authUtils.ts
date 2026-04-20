import { useState, useEffect } from 'react';

const ADMIN_CREDENTIALS = [
  { user: 'allbrazilianhenriz', pass: 'NeptuneGTA69' },
  { user: 'deepwebbrasileira', pass: 'SenhaTesteVouMudarDepois' },
  { user: 'gebriel', pass: 'SenhaTesteVouMudarDepois' }
];

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('dscpls_admin_auth') === 'true';
    setIsAdmin(loggedIn);
  }, []);

  const loginAdmin = (user: string, pass: string) => {
    const isValid = ADMIN_CREDENTIALS.some(c => c.user === user && c.pass === pass);
    if (isValid) {
      sessionStorage.setItem('dscpls_admin_auth', 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('dscpls_admin_auth');
    setIsAdmin(false);
  };

  return { isAdmin, loginAdmin, logoutAdmin };
}
