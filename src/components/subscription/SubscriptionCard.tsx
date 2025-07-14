import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Crown, Loader2 } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface SubscriptionCardProps {
  product: StripeProduct;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  product, 
  isCurrentPlan = false, 
  isPopular = false 
}) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call to your MongoDB backend
      // This should create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use your auth token
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start subscription process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative rounded-xl border-2 p-6 ${
      isPopular 
        ? 'border-primary bg-primary/5' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="h-4 w-4" />
            Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
        <p className="text-muted mb-4">{product.description}</p>
        
        <div className="mb-6">
          <span className="text-3xl font-bold text-foreground">$10</span>
          <span className="text-muted">/month</span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Premium tech marketplace access</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Exclusive deals and discounts</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Priority customer support</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Early access to new products</span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading || isCurrentPlan}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isCurrentPlan
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : isPopular
              ? 'bg-primary hover:bg-primary-dark text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : (
            'Subscribe Now'
          )}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;