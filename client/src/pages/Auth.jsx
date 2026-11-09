import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function Auth({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await (isRegister ? register(form) : login({ email: form.email, password: form.password })); notify(isRegister ? 'Your Guhasphere account is ready.' : 'Welcome back.'); navigate(location.state?.from || '/account', { replace: true }); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };
  return <main className="auth-page container"><div className="auth-art"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90" alt="Fashion editorial" /><div><span>THE GUHASPHERE CLUB</span><h2>Wear what<br /><em>feels like you.</em></h2></div><span className="auth-art-note">GOOD FINDS. GOOD FEELING. ✳</span></div><section className="auth-panel"><span className="eyebrow">{isRegister ? 'A NEW KIND OF EVERYDAY' : 'GOOD TO SEE YOU AGAIN'}</span><h1>{isRegister ? 'Create your account.' : 'Welcome back.'}</h1><p>{isRegister ? 'Join the list. Your next favourite is closer than you think.' : 'Sign in and pick up right where you left off.'}</p><form className="auth-form" onSubmit={submit}>{isRegister && <label>FULL NAME<input autoComplete="name" required value={form.name} onChange={change('name')} placeholder="Your name" /></label>}<label>EMAIL ADDRESS<input type="email" autoComplete="email" required value={form.email} onChange={change('email')} placeholder="you@example.com" /></label><label>PASSWORD<div className="password-input"><input type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={8} value={form.password} onChange={change('password')} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <div className="form-error">{error}</div>}<button className="button button-dark auth-submit" disabled={loading}>{loading ? 'PLEASE WAIT…' : isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'} <ArrowUpRight size={17} /></button></form><div className="auth-switch">{isRegister ? 'Already part of the club?' : 'New around here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></div><small className="auth-terms">By continuing, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</small></section></main>;
}
