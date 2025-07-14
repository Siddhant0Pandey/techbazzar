import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesSection from '../components/home/CategoriesSection';
import PromoBanner from '../components/home/PromoBanner';
import Brands from '../components/home/Brands';
import SubscriptionStatus from '../components/layout/SubscriptionStatus';
import { featuredProducts, newArrivals, bestSellers } from '../data/mockData';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <SubscriptionStatus />
      <HeroSection />
      
      <CategoriesSection />
      
      <FeaturedProducts 
        title="home.featured_products" 
        products={featuredProducts} 
        viewAllLink="/products?filter=featured" 
      />
      
      <PromoBanner />
      
      <FeaturedProducts 
        title="home.new_arrivals" 
        products={newArrivals} 
        viewAllLink="/products?filter=new" 
      />
      
      <FeaturedProducts 
        title="home.bestsellers" 
        products={bestSellers} 
        viewAllLink="/products?filter=bestsellers" 
      />
      
      <Brands />
      
      <section className="py-12 bg-surface">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t('home.why_choose_us', 'Why Choose TechBazaar?')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.authentic_products', 'Authentic Products')}</h3>
              <p className="text-muted">{t('home.authentic_products_desc', '100% genuine products directly from authorized sources.')}</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.fast_delivery', 'Fast Delivery')}</h3>
              <p className="text-muted">{t('home.fast_delivery_desc', 'Nationwide delivery within 3-7 business days.')}</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.secure_payment', 'Secure Payment')}</h3>
              <p className="text-muted">{t('home.secure_payment_desc', 'Multiple secure payment options including cash on delivery.')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;