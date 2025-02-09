'use client';
import { createContext, useState } from 'react';

interface FormNavContextProps {
	keyword: string | null;
	setKeyword: (keyword: string | null) => void;
	category: string[];
	setCategory: (category: string[]) => void;
}

export const FormNavContext = createContext<FormNavContextProps | null>(null);

export default function FormNavProvider({ children }: { children: React.ReactNode }) {
	const [keyword, setKeyword] = useState<string | null>(null);
	const [category, setCategory] = useState<string[]>([]);

	return <FormNavContext.Provider value={{ keyword, setKeyword, category, setCategory }}>{children}</FormNavContext.Provider>;
}
