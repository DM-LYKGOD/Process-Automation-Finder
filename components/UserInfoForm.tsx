import React, { useState } from 'react';
import { User } from '../types';

interface UserInfoFormProps {
    onNext: (user: User) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onNext }) => {
    const [user, setUser] = useState<User>({ name: '', company_name: '', email: '' });
    const [errors, setErrors] = useState<Partial<User>>({});

    const validate = (): boolean => {
        const newErrors: Partial<User> = {};
        if (!user.name.trim()) newErrors.name = "Name is required.";
        if (!user.company_name.trim()) newErrors.company_name = "Company name is required.";
        if (!user.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext(user);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Your Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Jane Doe"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
             <div className="space-y-2">
                <label htmlFor="company_name" className="block text-sm font-medium text-slate-700">Company Name</label>
                <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={user.company_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Acme Corp"
                />
                {errors.company_name && <p className="text-red-600 text-sm mt-1">{errors.company_name}</p>}
            </div>
             <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="jane.doe@acmecorp.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-colors">
                Next: Add Processes
            </button>
        </form>
    );
};

export default UserInfoForm;