import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                onLoginSuccess(data.user);
                navigate('/dashboard');
            } else {
                alert(data.message);
            }
        } catch (error) {
        }
    };

    return (
        <form className="login-card" onSubmit={handleSubmit}>
            <h2>LOGIN</h2>

            <Input
                label="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
            />

            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />

            <div style={{ marginTop: '30px' }}>
                <Button text="Login Account" variant="red" type="submit" />
            </div>
        </form>
    );
};

export default LoginForm;