// Basic test for Stripe-like payment logic
function testStripePayment() {
  // Simulate payment processing
  const payment = {
    amount: 100,
    currency: 'USD',
    status: 'pending',
    card: {
      number: '4242424242424242',
      exp: '12/30',
      cvc: '123'
    }
  };

  // Fake Stripe API response
  function fakeStripeAPI(payment) {
    if (payment.card.number === '4242424242424242' && payment.amount > 0) {
      return { status: 'succeeded', id: 'pi_12345' };
    }
    return { status: 'failed', error: 'Invalid card or amount' };
  }

  const response = fakeStripeAPI(payment);
  if (response.status === 'succeeded') {
    console.log('Payment succeeded:', response.id);
  } else {
    console.error('Payment failed:', response.error);
  }
}

testStripePayment();
