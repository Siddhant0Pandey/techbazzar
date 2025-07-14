import React from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const SubscriptionStatus: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { subscription, loading, isActive, plan } = useSubscription();

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!subscription) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex items-center">
          <Crown className="h-5 w-5 text-blue-400 mr-2" />
          <div className="flex-1">
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Upgrade to Premium for exclusive features and benefits.
            </p>
          </div>
          <Link
            to="/subscription"
            className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Learn More
          </Link>
        </div>
      </div>
    );
  }

  if (isActive && plan) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex items-center">
          <Crown className="h-5 w-5 text-green-400 mr-2" />
          <div className="flex-1">
            <p className="text-sm text-green-700 dark:text-green-200">
              <strong>Premium Active:</strong> You're subscribed to {plan.name}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
        <div className="flex-1">
          <p className="text-sm text-yellow-700 dark:text-yellow-200">
            Your subscription is being processed. This may take a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;