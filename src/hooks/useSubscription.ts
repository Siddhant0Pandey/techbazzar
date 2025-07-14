import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getProductByPriceId } from '../stripe-config';

interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useSubscription = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Mock subscription data - replace with actual API call to your MongoDB backend
    const mockSubscription: Subscription = {
      customer_id: user.id,
      subscription_id: 'sub_mock123',
      subscription_status: 'active',
      price_id: 'price_1RjcPkQGxX6RyzWMjSedIEEh',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
      cancel_at_period_end: false,
      payment_method_brand: 'visa',
      payment_method_last4: '4242'
    };

    // Simulate API call delay
    setTimeout(() => {
      setSubscription(mockSubscription);
      setLoading(false);
    }, 500);
  }, [isAuthenticated, user]);

  const getSubscriptionPlan = () => {
    if (!subscription?.price_id) return null;
    return getProductByPriceId(subscription.price_id);
  };

  const isActive = subscription?.subscription_status === 'active';
  const isPending = subscription?.subscription_status === 'not_started';

  return {
    subscription,
    loading,
    isActive,
    isPending,
    plan: getSubscriptionPlan(),
  };
};