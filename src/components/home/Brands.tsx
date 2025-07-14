import React from 'react';
import { useTranslation } from 'react-i18next';

const brands = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'xiaomi', name: 'Xiaomi' },
  { id: 'dell', name: 'Dell' },
  { id: 'hp', name: 'HP' },
  { id: 'sony', name: 'Sony' },
  { id: 'asus', name: 'ASUS' },
  { id: 'jbl', name: 'JBL' },
];

const Brands: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          {t('home.top_brands')}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <div 
              key={brand.id} 
              className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-foreground font-medium">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;