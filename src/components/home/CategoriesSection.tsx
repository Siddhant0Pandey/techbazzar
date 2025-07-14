import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import CategoryCard from '../ui/CategoryCard';
import { categories } from '../layout/Layout';

const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-surface">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t('home.categories')}</h2>
          <Link 
            to="/products"
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            {t('home.view_all')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id}
              id={category.id}
              name={category.name}
              nameNp={category.nameNp}
              icon={category.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;