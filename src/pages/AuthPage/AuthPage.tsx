import { FC, useState } from "react";
import { useAppDispatch } from "../../hooks"; // Use the typed dispatch hook
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../slices/userSlice"; // Import the new thunk
import "./AuthPage.css";

const Auth: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const dispatch = useAppDispatch(); // Use the typed dispatch hook
    const navigate = useNavigate();

    const toggleAuthMode = () => setIsRegister((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            if (isRegister) {
                // Dispatch registerUser thunk for registration
                const resultAction = await dispatch(registerUser({ email, password }));
                if (registerUser.fulfilled.match(resultAction)) {
                    navigate("/operations");
                } else {
                    console.log("Ошибка при регистрации");
                }
            } else {
                // Dispatch loginUser thunk for login
                const resultAction = await dispatch(loginUser({ email, password }));
                if (loginUser.fulfilled.match(resultAction)) {
                    navigate("/operations");
                } else {
                    console.log("Неверный логин или пароль");
                }
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка. Попробуйте снова.");
        }
    };

    return (
        <div className="auth-page">
            <h1>{isRegister ? "Регистрация" : "Вход"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    {isRegister ? "Зарегистрироваться" : "Войти"}
                </button>
            </form>
            <p>
                {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
                <button type="button" onClick={toggleAuthMode}>
                    {isRegister ? "Войти" : "Регистрация"}
                </button>
            </p>
        </div>
    );
};

export default Auth;