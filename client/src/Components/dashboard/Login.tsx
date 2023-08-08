import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice/userSlice'; // Update the path as needed
import { AppDispatch } from '../../app/store';
import './Login.css';

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();  // <-- Use the type here

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // You may want to select user or error from the Redux store if they are available.
    // const user = useSelector((state: RootState) => state.user.user); // Replace `RootState` with your store's state type
    // const error = useSelector((state: RootState) => state.user.error);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();



        try {
            await dispatch(login({ email, password }));
            // Redirect user to the dashboard or another page
        } catch (error) {
            // Here, you can handle errors based on the Redux state or the thrown error.
            // e.g., setErrorMessage(error.message || 'Error logging in');
            setErrorMessage('Error logging in');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
