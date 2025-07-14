import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Shield, Zap } from 'lucide-react';
import SubscriptionCard from '../components/subscription/SubscriptionCard';
import { stripeProducts } from '../stripe-config';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { subscription, loading, isActive, plan } = useSubscription();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Unlock premium features and get the most out of TechBazaar with our subscription plans.
        </p>
      </div>

      {/* Current Subscription Status */}
      {isAuthenticated && subscription && (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              {isActive ? (
                `You are currently subscribed to ${plan?.name || 'Premium Plan'}`
              ) : (
                'Your subscription is pending activation'
              )}
            </span>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Premium Access</h3>
          <p className="text-muted">Get exclusive access to premium products and features</p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Priority Support</h3>
          <p className="text-muted">Get faster response times and dedicated support</p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Exclusive Deals</h3>
          <p className="text-muted">Access to member-only discounts and early sales</p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="max-w-md mx-auto">
        {stripeProducts.map((product) => (
          <SubscriptionCard
            key={product.priceId}
            product={product}
            isCurrentPlan={isActive && plan?.priceId === product.priceId}
            isPopular={true}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
            <p className="text-muted">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted">We accept all major credit cards including Visa, Mastercard, and American Express through our secure payment processor.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-muted">Currently, we don't offer a free trial, but you can cancel your subscription at any time if you're not satisfied.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;