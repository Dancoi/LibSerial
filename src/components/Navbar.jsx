import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, TvMinimalPlay, User, LogOut, Menu, X, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

const NavBar = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Логотип */}
                    <Link to="/" className="flex items-center hover:text-indigo-200 transition-colors">
                        <TvMinimalPlay className="h-7 w-7 mr-1" />
                        <span className="text-xl font-bold">LibSerial</span>
                    </Link>

                    {/* Бургер */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="sm:hidden flex items-center focus:outline-none"
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Меню (десктоп) */}
                    <div className="hidden sm:flex space-x-6 text-lg">
                        <Link to="/" className="hover:text-indigo-200 transition-colors">Каталог</Link>
                        <Link to="/profile" className="hover:text-indigo-200 transition-colors">Мои Сериалы</Link>
                        <Link to="/compilation" className="hover:text-indigo-200 transition-colors">Подборки</Link>
                    </div>

                    {/* Аутентификация (десктоп) */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {!loading && (
                            user ? (
                                <>
                                    {user.Role.Role === 'admin' && (
                                        <Link
                                            to="/admin/series"
                                            className="flex items-center hover:text-indigo-200 transition-colors"
                                            title="Админ-панель"
                                        >
                                            <Shield className="h-5 w-5 mr-1" />
                                            Админ
                                        </Link>
                                    )}

                                    <Link to="/profile" className="flex items-center hover:text-indigo-200 transition-colors">
                                        <User className="h-5 w-5 mr-1" />
                                        <span>{user.Name || "Null"}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center hover:text-indigo-200 transition-colors">
                                        <LogOut className="h-5 w-5 mr-1" />
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center hover:text-indigo-200 transition-colors">
                                        <LogIn className="h-5 w-5 mr-1" />
                                        Авторизация
                                    </Link>
                                    <Link to="/register" className="flex items-center hover:text-indigo-200 transition-colors">
                                        <UserPlus className="h-5 w-5 mr-1" />
                                        Регистрация
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>

                {/* Мобильное меню */}
                {menuOpen && (
                    <div className="sm:hidden flex flex-col gap-4 pb-4 text-base border-t border-indigo-500">
                        <Link to="/" className="hover:text-indigo-200 transition-colors">Каталог</Link>
                        <Link to="/profile" className="hover:text-indigo-200 transition-colors">Сериалы</Link>
                        <Link to="/compilation" className="hover:text-indigo-200 transition-colors">Подборки</Link>

                        {!loading && (
                            user ? (
                                <>
                                    {user.Role.Role === 'admin' && (
                                        <Link
                                            to="/admin/series"
                                            className="flex items-center hover:text-indigo-200 transition-colors"
                                        >
                                            <Shield className="h-5 w-5 mr-1" />
                                            Админ-панель
                                        </Link>
                                    )}
                                    <Link to="/profile" className="flex items-center hover:text-indigo-200 transition-colors">
                                        <User className="h-5 w-5 mr-1" />
                                        <span>{user.Name || "Null"}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center hover:text-indigo-200 transition-colors">
                                        <LogOut className="h-5 w-5 mr-1" />
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center hover:text-indigo-200 transition-colors">
                                        <LogIn className="h-5 w-5 mr-1" />
                                        Авторизация
                                    </Link>
                                    <Link to="/register" className="flex items-center hover:text-indigo-200 transition-colors">
                                        <UserPlus className="h-5 w-5 mr-1" />
                                        Регистрация
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
