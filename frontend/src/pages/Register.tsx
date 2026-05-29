import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Útil para redirecionar após o sucesso
import { api } from '../services/api';  
import { Input } from '../components/Input';
import { Calendar } from 'lucide-react';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validação básica de senha correspondente antes de enviar ao back
        if (password !== confirmPassword) {
            return setError('As senhas não coincidem.');
        }

        setLoading(true);

        try {
            // Ajuste a rota para a do seu backend de criação de usuário (ex: /users ou /auth/register)
            await api.post('/users', { 
                name, 
                email, 
                password 
            });

            // Após registrar com sucesso, joga o usuário para a tela de login
            navigate('/login'); 
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
            <div className='max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100'>
                
                {/* Cabeçalho Identificando o Sistema */}
                <div className='flex flex-col items-center mb-8'>
                    <div className='p-3 bg-blue-50 text-blue-500 rounded-2xl mb-3'>
                        <Calendar size={32} />
                    </div>
                    <h1 className='text-2xl font-bold text-slate-900'>EcoSystem Scheduler</h1>
                    <p className='text-sm text-slate-500 mt-1'>Crie sua conta para gerenciar agendamentos</p>
                </div>

                {/* Exibição de Erros */}
                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium'>
                        {error}
                    </div>
                )}

                {/* Formulário de Registro */}
                <form onSubmit={handleSubmit}>
                    <Input
                        label='Nome completo'
                        type='text'
                        placeholder='Seu nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    
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

                    <Input
                        label='Confirmar Senha'
                        type='password'
                        placeholder='********'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type='submit'
                        className='w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4'
                        disabled={loading}
                    >
                        {loading ? 'Criando conta...' : 'Cadastrar'}
                    </button>
                </form>

                {/* Link de Navegação de volta para o Login */}
                <div className='mt-6 text-center'>
                    <p className='text-sm text-slate-600'>
                        Já tem uma conta?{' '}
                        <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                            Faça login
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};