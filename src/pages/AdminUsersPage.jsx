import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2, ShieldCheck, ShieldX, Search } from 'lucide-react';
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                console.log(decoded)
                setCurrentUserId(decoded.user_id);

                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.error("Ошибка при получении пользователей:", err);
                setError(err.response?.data || 'Ошибка загрузки пользователей');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Удалить пользователя?',
            text: 'Это действие нельзя отменить.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(users.filter(user => user.ID !== id));
                Swal.fire('Удалено!', 'Пользователь успешно удален.', 'success');
            } catch (err) {
                console.error("Ошибка при удалении:", err);
                Swal.fire('Ошибка!', 'Не удалось удалить пользователя.', 'error');
            }
        }
    };

    const handleToggleAdmin = async (user) => {
        const newRole = user.Role === 'admin' ? 'user' : 'admin';

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/users/${user.ID}/role`, { role: newRole }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.map(u => u.ID === user.ID ? { ...u, Role: newRole } : u));
            Swal.fire('Успешно!', `Права пользователя обновлены: ${newRole}`, 'success');
        } catch (err) {
            console.error("Ошибка при обновлении роли:", err);
            Swal.fire('Ошибка!', 'Не удалось обновить роль пользователя.', 'error');
        }
    };

    // const filteredUsers = users.filter(user =>
    //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // const filteredUsers = users.filter(user =>
    //     (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //     (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    // );
    const filteredUsers = users
        .filter(user => user.ID !== currentUserId)
        .filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.Email && user.Email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="mx-auto px-4 py-8 rounded-xl shadow-md">
            {/*<h1 className="text-3xl font-bold text-indigo-600 border-l-4 border-indigo-500 pl-4 mb-4">*/}
            {/*    Управление пользователями*/}
            {/*</h1>*/}
            <div className="flex items-center justify-between mb-4">
                <Link
                    to="/admin/series"
                    className="text-2xl text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline transition pl-4 border-l-3"
                >
                    Управление сериалами
                </Link>

                <h1 className="text-3xl font-bold text-indigo-600 border-r-4 border-indigo-500 pr-4 mb-0">
                    Управление пользователями
                </h1>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        placeholder="Поиск по имени или email"
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left">Имя</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Роль</th>
                            <th className="py-3 px-4 text-right">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.ID} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{user.Name}</td>
                                    <td className="py-3 px-4">{user.Email}</td>
                                    <td className="py-3 px-4 capitalize">{user.Role?.Role}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end space-x-2">
                                            {/*<button*/}
                                            {/*    onClick={() => handleToggleAdmin(user)}*/}
                                            {/*    className={`p-2 ${*/}
                                            {/*        user.Role === 'admin'*/}
                                            {/*            ? 'text-yellow-600 hover:text-yellow-800'*/}
                                            {/*            : 'text-green-600 hover:text-green-800'*/}
                                            {/*    }`}*/}
                                            {/*    title={user.Role === 'admin' ? 'Снять роль админа' : 'Назначить админом'}*/}
                                            {/*>*/}
                                            {/*    {user.Role === 'admin' ? <ShieldX className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}*/}
                                            {/*</button>*/}
                                            <button
                                                onClick={() => handleToggleAdmin(user)}
                                                disabled={user.Role === 'admin'}
                                                className={`p-2 ${
                                                    user.Role === 'admin'
                                                        ? 'text-yellow-600 hover:text-yellow-800 cursor-not-allowed opacity-50'
                                                        : 'text-green-600 hover:text-green-800'
                                                }`}
                                                title={user.Role === 'admin' ? 'Нельзя изменить роль другого админа' : 'Назначить админом'}
                                            >
                                                {user.Role === 'admin' ? <ShieldX className="h-5 w-5"/> :
                                                    <ShieldCheck className="h-5 w-5"/>}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.ID)}
                                                className="p-2 text-red-600 hover:text-red-800"
                                                title="Удалить"
                                            >
                                                <Trash2 className="h-5 w-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-6 text-center text-gray-500">
                                    {searchTerm ? 'Пользователи не найдены' : 'Нет зарегистрированных пользователей'}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                     role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
