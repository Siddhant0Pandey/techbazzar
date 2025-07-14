import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';

const SubscriptionSuccessPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // You could add analytics tracking here
    console.log('Subscription success page viewed');
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Welcome to TechBazaar Premium!
        </h1>
        
        <p className="text-lg text-muted mb-8">
          Your subscription has been successfully activated. You now have access to all premium features and benefits.
        </p>

        {/* Benefits List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Premium Benefits</h2>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Premium tech marketplace access</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Exclusive deals and discounts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Priority customer support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Early access to new products</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="btn btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            to="/profile"
            className="btn btn-outline flex items-center justify-center gap-2 px-6 py-3"
          >
            View Profile
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>What's next?</strong> You'll receive a confirmation email shortly with your subscription details. 
            If you have any questions, our support team is here to help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;