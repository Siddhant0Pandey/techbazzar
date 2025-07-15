import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Hammer, Wrench, Sofa, Building2, TreePine, HardHat } from 'lucide-react';

export const categories = [
  { id: 'power-tools', name: 'Power Tools', nameNp: 'पावर उपकरणहरू', icon: Hammer },
  { id: 'hand-tools', name: 'Hand Tools', nameNp: 'हात उपकरणहरू', icon: Wrench },
  { id: 'furniture', name: 'Furniture', nameNp: 'फर्निचर', icon: Sofa },
  { id: 'workshop-equipment', name: 'Workshop Equipment', nameNp: 'कार्यशाला उपकरणहरू', icon: Building2 },
  { id: 'wood-materials', name: 'Wood Materials', nameNp: 'काठका सामग्रीहरू', icon: TreePine },
  { id: 'safety-equipment', name: 'Safety Equipment', nameNp: 'सुरक्षा उपकरणहरू', icon: HardHat },
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