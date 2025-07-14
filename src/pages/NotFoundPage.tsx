import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">{t('not_found.title', 'Page Not Found')}</h2>
        <p className="text-muted mb-8">{t('not_found.description', "We couldn't find the page you're looking for.")}</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary flex items-center">
            <Home className="mr-2 h-4 w-4" />
            {t('common.home')}
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('not_found.go_back', 'Go Back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;