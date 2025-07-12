import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const PaymentDebug = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPaymentFlow = async (planName: string, priceId: string) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    addResult(`Testing ${planName} payment...`);

    try {
      // Test environment variables
      const hasPublishableKey = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      addResult(`Stripe publishable key: ${hasPublishableKey ? 'Found' : 'Missing'}`);

      // Test API endpoint
      addResult('Calling createCheckoutSession...');
      const session = await createCheckoutSession(priceId, user.id);
      
      addResult(`Session created: ${session ? 'Success' : 'Failed'}`);
      
      if (session) {
        addResult(`Session ID: ${session.sessionId || 'Missing'}`);
        addResult(`Session URL: ${session.url ? 'Found' : 'Missing'}`);
        
        if (session.url) {
          addResult('Redirecting to Stripe...');
          // Don't actually redirect in debug mode
          // window.location.href = session.url;
          toast.success('Payment session created successfully! (Debug mode - not redirecting)');
        } else {
          addResult('ERROR: No session URL received');
          toast.error('No payment URL received');
        }
      } else {
        addResult('ERROR: No session returned');
        toast.error('Failed to create payment session');
      }
    } catch (error) {
      addResult(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Payment debug error:', error);
      toast.error('Payment test failed');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment System Debug</CardTitle>
          <CardDescription>
            Test payment flows and debug issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Check */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Environment Variables</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Publishable Key: {' '}
                  <Badge variant={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                    {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing'}
                  </Badge>
                </div>
                <div>
                  Mock Mode: {' '}
                  <Badge variant={import.meta.env.VITE_MOCK_PAYMENTS === 'true' ? "secondary" : "default"}>
                    {import.meta.env.VITE_MOCK_PAYMENTS === 'true' ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">User Status</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Logged In: {' '}
                  <Badge variant={user ? "default" : "destructive"}>
                    {user ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {user && (
                  <div className="text-xs text-gray-600">
                    User ID: {user.id}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <h3 className="font-semibold">Test Payment Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                onClick={() => testPaymentFlow('Pay-as-you-go', STRIPE_PRICES.payAsYouGo.priceId)}
                disabled={loading || !user}
                variant="outline"
                size="sm"
              >
                Test Pay-as-you-go
              </Button>
              
              <Button
                onClick={() => testPaymentFlow('Starter Monthly', STRIPE_PRICES.starter.monthly)}
                disabled={loading || !user}
                variant="outline"
                size="sm"
              >
                Test Starter Monthly
              </Button>
              
              <Button
                onClick={() => testPaymentFlow('Professional Monthly', STRIPE_PRICES.professional.monthly)}
                disabled={loading || !user}
                variant="outline"
                size="sm"
              >
                Test Professional Monthly
              </Button>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Test Results</h3>
              <Button
                onClick={clearResults}
                variant="outline"
                size="sm"
                disabled={testResults.length === 0}
              >
                Clear
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-sm">No test results yet. Click a test button above.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price IDs Reference */}
          <div className="space-y-2">
            <h3 className="font-semibold">Price IDs Reference</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div>Pay-as-you-go: {STRIPE_PRICES.payAsYouGo.priceId}</div>
                <div>Starter Monthly: {STRIPE_PRICES.starter.monthly}</div>
                <div>Professional Monthly: {STRIPE_PRICES.professional.monthly}</div>
                <div>Career Pro Monthly: {STRIPE_PRICES.careerPro.monthly}</div>
                <div>Elite Executive Monthly: {STRIPE_PRICES.eliteExecutive.monthly}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDebug; 