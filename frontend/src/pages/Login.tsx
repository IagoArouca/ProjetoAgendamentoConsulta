import React, { useState } from 'react';
import { api } from '../services/api';  
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/Input';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';


export const Login: React.FC = () => {
    const loginStore = useAuthStore((state) => state.login );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password});
            const { user, backend_token } = response.data;

            loginStore(user, backend_token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
            <div className='max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100'>
                <div className='flex flex-col items-center mb-8'>
                    <div className='p-3 bg-blue-50 text-blue-500 rounded-2xl mb-3'>
                        <Calendar size={32} />
                    </div>
                    <h1 className='text-2xl font-bold text-slate-900'>EcoSystem Scheduler</h1>
                    <p className='text-sm text-slate mt-1'>Gerencie seus agendamentos em tempo real</p>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label='E-mail profissional'
                        type='email'
                        placeholder='seu@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label='Senha'
                        type='password'
                        placeholder='********'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type='submit'
                        className='w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2'
                        disabled={loading}
                    >
                        {loading ? 'Fazendo login...' : 'Entrar'}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-slate-600'>
                        Não tem uma conta?{' '}
                        <Link to='/register' className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                            Cadastre-se
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};