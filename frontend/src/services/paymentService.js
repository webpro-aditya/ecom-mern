// src/services/paymentService.js
const PaymentService = {
  async createRazorpayOrder(amount) {
    const response = await api.post('/payments/create', { 
      amount, 
      gateway: 'razorpay' 
    })
    return response.data
  },
  
  async verifyPayment(paymentData) {
    return api.post('/payments/verify', paymentData)
  }
}
