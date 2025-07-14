import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            {t('home.hero_title')}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/products"
              className="btn bg-white text-primary hover:bg-gray-100 transition-colors font-semibold px-6 py-3 rounded-lg inline-flex items-center"
            >
              {t('home.shop_now')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/products?filter=deals"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary transition-colors font-semibold px-6 py-3 rounded-lg"
            >
              {t('home.special_offers')}
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Latest tech gadgets" 
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
            <div className="absolute -bottom-4 -right-4 bg-secondary text-white text-lg font-bold py-2 px-4 rounded-lg shadow-lg transform rotate-3">
              {t('home.up_to_20_off', 'Up to 20% off')}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.7,-70.5C58.9,-62.5,69.3,-48.8,75.9,-33.3C82.5,-17.8,85.4,-0.5,82.4,15.3C79.3,31.1,70.3,45.4,58.1,57C45.8,68.7,30.3,77.8,13.2,81.8C-3.9,85.8,-22.5,84.7,-38.3,77.1C-54.1,69.6,-67,55.5,-75.1,39.3C-83.2,23.1,-86.5,4.8,-83.5,-12.4C-80.6,-29.7,-71.4,-45.8,-58.1,-54.6C-44.8,-63.4,-27.3,-64.9,-10.6,-67.1C6,-69.3,32.5,-78.5,45.7,-70.5Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M37.7,-65.7C47.9,-56.8,54.5,-43.4,62.4,-29.9C70.3,-16.4,79.5,-2.9,77.2,8.5C74.9,19.9,61.2,29.3,48.9,35.5C36.5,41.8,25.5,45,13.3,51.4C1.2,57.7,-12.1,67.3,-25.1,67.7C-38.1,68.2,-50.9,59.5,-61.6,47.7C-72.3,35.9,-81,20.9,-82.1,5.2C-83.3,-10.5,-76.9,-26.8,-66,-38C-55.1,-49.1,-39.8,-55.1,-26.3,-62.1C-12.7,-69,-6.4,-77,-0.1,-76.6C6.2,-76.3,27.5,-74.6,37.7,-65.7Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;