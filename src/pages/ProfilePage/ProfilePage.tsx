// ProfilePage.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateProfile } from "../../slices/userSlice";
import "./ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.user.userName);
  const [email, setEmail] = useState(userName || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const error = useAppSelector((state) => state.user.error);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateProfile({ email, password })).unwrap();
      setPassword("");
      alert("Данные успешно обновлены.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="profile-form"
      >
        <label>
          <h1 className="profile__title">Почта:</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <h1 className="profile__title">Пароль:</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите новый пароль"
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfilePage;