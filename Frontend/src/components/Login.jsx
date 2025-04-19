import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../redux/features/users/usersApi';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../redux/features/auth/authSlice';
import { handleError, handleSuccess } from '../utils/authSwal';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginUser] = useLoginUserMutation();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            dispatch(setLoading());
            const response = await loginUser(data).unwrap();
            if (response.token) {
                localStorage.setItem('token', response.token);
                dispatch(setUser({ 
                    user: response.user, 
                    token: response.token, 
                    email: response.email, 
                    role: response.role 
                }));
                handleSuccess('Login successful!');
                setTimeout(() => navigate('/'), 500);
            } else {
                handleError(response.message || "Login failed");
            }
        } catch (error) {
            const errorDetails = error?.data?.errors || [{ message: error.data?.message || "Login failed!" }];
            errorDetails.forEach((err) => handleError(err.message));
        } 
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Cozy Corner</h2>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            type="email"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            type="password"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;