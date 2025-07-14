// DEPRECATED: This file has been replaced by AuthContext
// Please use: import { useAuth } from '../context/AuthContext';

import { useAuth as useAuthContext } from '../context/AuthContext';

// Re-export the context-based useAuth to maintain compatibility
export const useAuth = useAuthContext;

// Note: This hook now properly connects to the MongoDB backend
// instead of using mock authentication