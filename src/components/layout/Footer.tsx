import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ShoppingCart } from 'lucide-react';

interface CategoryType {
  id: string;
  name: string;
  nameNp: string;
  icon: React.FC<{ className?: string }>;
}

interface FooterProps {
  categories: CategoryType[];
}

const Footer: React.FC<FooterProps> = ({ categories }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">CraftWorks</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.company_description', "Nepal's leading online store for technology products with nationwide delivery and excellent customer service.")}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('home.categories')}</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/products?category=${category.id}`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {currentLanguage === 'en' ? category.name : category.nameNp}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/products"
                  className="text-gray-400 hover:text-primary transition-colors font-semibold"
                >
                  {t('home.view_all')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quick_links', 'Quick Links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  {t('footer.about_us', 'About Us')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  {t('footer.contact_us', 'Contact Us')}
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-400 hover:text-primary transition-colors">
                  {t('footer.shipping_policy', 'Shipping Policy')}
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-gray-400 hover:text-primary transition-colors">
                  {t('footer.return_policy', 'Return Policy')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">
                  {t('footer.privacy_policy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                  {t('footer.terms', 'Terms & Conditions')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact_us', 'Contact Us')}</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-400">
                  {t('footer.address', 'Newroad, Kathmandu, Nepal')}
                </span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-400">+977 01-4567890</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                                  <span className="text-gray-400">info@craftworks.com.np</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Esewa_logo.png" alt="eSewa" className="h-8" />
          <img src="https://play-lh.googleusercontent.com/sLhRuUmFX6m4-3uS5lMlDzApUFLZK2C9U4VL6GzYtFSQJRJg5qe7mfPouOAM_pZzpg4" alt="Khalti" className="h-8" />
          <img src="https://connectips.com/images/logo.png" alt="Connect IPS" className="h-8" />
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CraftWorks. {t('footer.all_rights_reserved', 'All Rights Reserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;