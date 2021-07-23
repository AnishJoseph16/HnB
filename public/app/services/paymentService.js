hbiApp.factory('paymentService', function($http) { 
    return {

    getPaymentSession: function (paymentInput) { 
				  return $http({
						method: 'POST',
                        url: "https://checkout-test.adyen.com/v32/paymentSession",
                        data: paymentInput,
						headers: {
                            "X-API-Key": "",
                            "Content-Type": "application/json"
						},
						complete: function() {
							console.log('done');
						}
					})
    }
  };
});
