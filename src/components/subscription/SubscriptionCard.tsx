import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { StripeProduct } from '../../types';
import { stripeAPI } from '../../lib/api';

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
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const response = await stripeAPI.createCheckoutSession({
        price_id: product.priceId,
        mode: product.mode,
        success_url: `${window.location.origin}/subscription/success`,
        cancel_url: `${window.location.origin}/subscription`,
      });

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      relative rounded-xl border p-6 shadow-sm transition-all duration-200
      ${isPopular 
        ? 'border-primary bg-primary/5 scale-105' 
        : 'border-border bg-background hover:border-primary/50'
      }
    `}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-foreground">
            ${product.price}
          </span>
          <span className="text-muted-foreground ml-1">
            /{product.interval}
          </span>
        </div>
        <p className="text-muted-foreground mb-6">{product.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {product.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isCurrentPlan || loading}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
          ${isCurrentPlan
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : isPopular
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-background border border-border text-foreground hover:bg-muted'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading 
          ? 'Processing...' 
          : isCurrentPlan 
          ? 'Current Plan' 
          : `Subscribe to ${product.name}`
        }
      </button>
    </div>
  );
};

export default SubscriptionCard;