import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '../product/ProductGrid';
import { Product } from '../../types';

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ title, products, viewAllLink }) => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t(title)}</h2>
          <Link 
            to={viewAllLink}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            {t('home.view_all')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <ProductGrid products={products} />
      </div>
    </section>
  );
};

export default FeaturedProducts;