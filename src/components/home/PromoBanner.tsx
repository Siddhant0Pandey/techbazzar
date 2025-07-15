import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PromoBanner: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-lg overflow-hidden h-64">
            <img 
              src="https://images.pexels.com/photos/3178938/pexels-photo-3178938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Power Tool Deals" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('home.power_tool_deals', 'Power Tool Deals')}
              </h3>
              <p className="text-white text-opacity-90 mb-4">
                {t('home.up_to_30_off', 'Up to 30% off on professional tools')}
              </p>
              <Link 
                to="/products?category=power-tools&filter=deals"
                className="inline-block bg-white text-primary font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-max"
              >
                {t('home.shop_now')}
              </Link>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-64">
            <img 
              src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Furniture Offers" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/20 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('home.furniture_offers', 'Furniture Offers')}
              </h3>
              <p className="text-white text-opacity-90 mb-4">
                {t('home.save_big_furniture', 'Save big on handcrafted furniture')}
              </p>
              <Link 
                to="/products?category=furniture&filter=deals"
                className="inline-block bg-white text-secondary font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-max"
              >
                {t('home.shop_now')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;