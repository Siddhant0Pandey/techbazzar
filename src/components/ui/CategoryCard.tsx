import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  id: string;
  name: string;
  nameNp: string;
  icon: React.FC<{ className?: string }>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, nameNp, icon: Icon }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const displayName = currentLanguage === 'np' ? nameNp : name;
  
  return (
    <Link 
      to={`/products?category=${id}`}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-2">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground">{displayName}</span>
    </Link>
  );
};

export default CategoryCard;