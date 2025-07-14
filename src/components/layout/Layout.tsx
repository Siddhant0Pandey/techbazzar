import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Laptop, Smartphone, Headphones, Watch, Speaker, Gamepad, Camera, Tablet } from 'lucide-react';

export const categories = [
  { id: 'smartphones', name: 'Smartphones', nameNp: 'स्मार्टफोन', icon: Smartphone },
  { id: 'laptops', name: 'Laptops', nameNp: 'ल्यापटप', icon: Laptop },
  { id: 'tablets', name: 'Tablets', nameNp: 'ट्याब्लेट', icon: Tablet },
  { id: 'headphones', name: 'Headphones', nameNp: 'हेडफोन', icon: Headphones },
  { id: 'smartwatches', name: 'Smartwatches', nameNp: 'स्मार्टवाच', icon: Watch },
  { id: 'speakers', name: 'Speakers', nameNp: 'स्पिकर', icon: Speaker },
  { id: 'gaming', name: 'Gaming', nameNp: 'गेमिङ', icon: Gamepad },
  { id: 'cameras', name: 'Cameras', nameNp: 'क्यामेरा', icon: Camera },
];

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer categories={categories} />
    </div>
  );
};

export default Layout;