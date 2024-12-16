import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../slices/userSlice";
import API from "../../api/API";
import "./AuthPage.css";

const Auth: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleAuthMode = () => setIsRegister((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            let response;
            if (isRegister) {
                response = await API.auth({ email, password });
                const data = await response.json();
                if (data.status === "Success") {
                    const authResponse = await API.login({ email, password });
                    const authData = await authResponse.json();
    
                    if (authData.status === "ok") {
                        dispatch(login({ username: authData.username, isStaff: authData.is_staff }));
                        navigate("/operations");
                    } else {
                        console.log("Ошибка при авторизации");
                    }
                } else {
                    console.log("Ошибка регистрации");  
                }
            } else {
                response = await API.login({ email, password });
                const data = await response.json();
    
                if (data.status === "ok") {
                    dispatch(login({ username: data.username, isStaff: data.is_staff }));
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