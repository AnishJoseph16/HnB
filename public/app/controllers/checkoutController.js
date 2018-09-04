hbiApp.controller('checkoutController', ['$scope','$http','$state','$rootScope','$location','paymentService','headerService','checkoutService','productlistService', function($scope, $http, $state,$rootScope,$location,paymentService,headerService,checkoutService, productlistService) {
	
	
	$scope.init = function(){
		//getDeliveryOptions();
	}
	
	$scope.emailFlag=true;
	$scope.btn_text="Enter email address";

	$scope.validate=function(){
		//console.log($scope.emailAddress);
		if($scope.deliverydetails.email.length>0){
			$scope.emailFlag=false;
			$scope.btn_text="Continue";
		}
	}
	
	$scope.openWindow=function(){
		$("#js-welcome-guest").removeClass("hidden");
		$("#js-welcome-email-submit").addClass("hidden");
	}
	
	$scope.changeSection=function(value){
		if(value==="Yes"){
			$("#js-welcome-create-account").removeClass("hidden");
			$("#IAgree").removeClass("hidden");
			$("#js-welcome-create-account-submit").removeClass("hidden");
			$("#js-welcome-guest-submit").addClass("hidden");
		}else if(value==="No"){
			$("#js-welcome-create-account").addClass("hidden");
			$("#IAgree").addClass("hidden");
			$("#js-welcome-create-account-submit").addClass("hidden");			
			$("#js-welcome-guest-submit").removeClass("hidden");
		}
	}
	
	$scope.continueAsGuest=function(){
		$("#welcome").toggleClass("completed");	
		if($("#welcome").hasClass("completed")){			
			$("#deliveryContent").removeClass("hidden");
		}else if(!($("#welcome").hasClass("completed"))){
			$("#delivery").addClass("completed");
		}			
	}
	
	$scope.toggleDelivery=function(){
		if($("#delivery").hasClass("completed")){			
			$("#welcome").addClass("completed");
			$("#delivery").removeClass("completed");
			$("#collectionMethod").addClass("hidden");
			$("#deliveryMethod").addClass("hidden");
		}else if(!($("#welcome").hasClass("completed"))){
			$("#welcome").removeClass("completed");
			$("#delivery").addClass("completed");
		}
	}
	
	$scope.setDelivery=function(shipmentMode){
		
		if(shipmentMode == "Delivery"){
			$("#collectionMethod").addClass("hidden");
			$("#deliveryMethod").removeClass("hidden");
			//$scope.showAddressSection = true;
			/*
			var cart = headerService.sessionGet('cart');
			var shipmentData = {};
			shipmentData.version = cart.version;
			shipmentData.actions = [{"action":"setShippingMethod","shippingMethod":{"typeId":"shipping-method","id":"bca1b075-1207-4e67-ba95-4b66810b7c7a"}}];
			checkoutService.setShipment(cart.id, shipmentData).then(function(response) {
				
			});
			*/
		}
	}
	
	$scope.pincode=true;
	$scope.checkPincode=function(){
		if($scope.postCodeValue!=="" ||$scope.postCodeValue!==null || $scope.postCodeValue!==undefined){
			$scope.pincode=false;
		}else{
			$scope.pincode=true;
		}
	}
	//$scope.deliveryChooseButton=true;
	$scope.deliveryMessage="Enter delivery details";
	$scope.findAddress=function(){
		$("#addressDetails").removeClass("hidden");
	}
 
	$scope.showAddressInfo=function(){
		$("#AddressInfo").removeClass("hidden");
		$("#phoneNumber").removeClass("hidden");
	}
	
	$scope.checkPhone=function(){
		if($scope.phoneNumberValue!=="" ||$scope.phoneNumberValue!==null || $scope.phoneNumberValue!==undefined){
			$scope.deliveryChooseButton=false;
			$scope.deliveryMessage="Choose Delivery";
		}else{
			$scope.deliveryChooseButton=true;
			$scope.deliveryMessage="Enter delivery details";			
		}
	}
	
	$scope.saveAddressnProceed=function(data){
		var cart = headerService.sessionGet('cart');
		var shipmentData = {};
		var addressJson = {};
		var customerJson = {};
		var billingAddresJson = {};
		var countryJson = {};
		var shipmentMethodJson = {};
		shipmentData.version = cart.version;
		shipmentData.actions = [];
		
		addressJson.action = "setShippingAddress";
		addressJson.address = $scope.deliverydetails;
		shipmentData.actions.push(addressJson);
		
		customerJson.action = "setCustomerEmail";
		customerJson.email = $scope.deliverydetails.email;
		shipmentData.actions.push(customerJson);
		
		billingAddresJson.action = "setBillingAddress";
		shipmentData.actions.push(billingAddresJson);
		
		shipmentMethodJson.action = "setShippingMethod";
		shipmentMethodJson.shippingMethod = {};
		shipmentMethodJson.shippingMethod.typeId = "shipping-method";
		shipmentMethodJson.shippingMethod.id = "bca1b075-1207-4e67-ba95-4b66810b7c7a";
		shipmentData.actions.push(shipmentMethodJson);
		
		countryJson.action = "setCountry";
		countryJson.email = "GB";
		shipmentData.actions.push(countryJson);	
		productlistService.cartActions(cart, shipmentData).then(function(response) { 
			cart.id = response.data.id;
			cart.version = response.data.version;
			headerService.sessionSet('cart', cart);
			$scope.cartSaveData = response;
			if(data==="continueToPayment"){
				$("#continueToPayment").removeClass("hidden");
				$("#addressSection").addClass("hidden");
			}else{
				$("#continueToPayment").addClass("hidden");
				$("#addressSection").removeClass("hidden");
			}
		});
		
		/*
		checkoutService.addAddressToCart(cart.id, shipmentData).then(function(response) {
				
		});
		
			
		if(data==="continueToPayment"){
			$("#continueToPayment").removeClass("hidden");
			$("#addressSection").addClass("hidden");
		}else{
			$("#continueToPayment").addClass("hidden");
			$("#addressSection").removeClass("hidden");
		}
		
		*/
	}
	
	$scope.goToBilling=function(data){
		var cartData = headerService.sessionGet('cart');
		var paymentData = {
			  "amountPlanned": {
				"currencyCode": cartData.totalPrice.currencyCode,
				"centAmount":cartData.totalPrice.centAmount
			  }
			};
		checkoutService.createPayment(paymentData).then(function(response){
			headerService.sessionSet('paymentData',{"id":response.id});
			if(data==="billing"){
			$("#delivery").removeClass("completed");
			$("#billing").addClass("completed");
			}else if(data==="Delivery"){
				$("#delivery").addClass("completed");
				$("#billing").removeClass("completed");
			}
		});	
		
	}

	$scope.goToPayment = function(){
		console.log("Goto payment");
		//var paymentSession = $scope.createPaymentSession();
		var sdkConfigObj = {
			context : 'test', 
			useDefaultCSS  : 'false'// change it to 'live' when going live.
	  	};
	  var paymentSession = 'eyJjaGVja291dHNob3BwZXJCYXNlVXJsIjoiaHR0cHM6XC9cL2NoZWNrb3V0c2hvcHBlci10ZXN0LmFkeWVuLmNvbVwvY2hlY2tvdXRzaG9wcGVyXC8iLCJkaXNhYmxlUmVjdXJyaW5nRGV0YWlsVXJsIjoiaHR0cHM6XC9cL2NoZWNrb3V0c2hvcHBlci10ZXN0LmFkeWVuLmNvbVwvY2hlY2tvdXRzaG9wcGVyXC9zZXJ2aWNlc1wvUGF5bWVudEluaXRpYXRpb25cL3YxXC9kaXNhYmxlUmVjdXJyaW5nRGV0YWlsIiwiZ2VuZXJhdGlvbnRpbWUiOiIyMDE4LTA5LTA0VDEzOjAyOjM0WiIsImh0bWwiOiJcblxuXG5cblxuXG48ZGl2IGNsYXNzPVwiY2hja3Qtc2RrXCIgaWQ9XCJjby0xNTM2MDY2MTU0OTM0LTM4OFwiIGRhdGEtcGF5bWVudC1jb250YWluZXI+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY2hja3QtbXVzdGFjaGUtdGVtcGxhdGVzXCI+XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwidGV4dEZpZWxkVHlwZVwiPlxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsIGNoY2t0LWZvcm0tbGFiZWwtLWZ1bGwtd2lkdGhcIiBkYXRhLWVucmljaD1cInt7a2V5fX1cIiA+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX190ZXh0XCI+e3t7dHJhbnNsYXRlSGVscGVyIGtleX19fTo8XC9zcGFuPlxuICAgIHt7ISBSZXR1cm5maWVsZHR5cGUgd2lsbCBjcmVhdGUgYSBqcyB2YXJpYWJsZSBmcm9tIHRoZSBrZXkgYW5kIGF0dGFjaCBpdCB0byB0aGUgY2xhc3Mgb2YgdGhlIGZpZWxkIH19XG4gICAgPGlucHV0IGNsYXNzPVwiY2hja3QtaW5wdXQtZmllbGQge3t7cmV0dXJuRmllbGRUeXBlSGVscGVyIGtleX19fVwiIG5hbWU9XCJ7e2tleX19XCIgcGxhY2Vob2xkZXI9XCJ7e3BsYWNlaG9sZGVyfX1cIiBkYXRhLXNob3BwZXItbG9jYWxlPVwie3toX3Nob3BwZXJMb2NhbGV9fVwiIHR5cGU9XCJ0ZXh0XCIgc2l6ZT1cIjIwXCJcbiAgICAgICAgICAgb25rZXl1cD1cInt7cmV0dXJuVGV4dEZpZWxkVHlwZUZueUhlbHBlciBrZXl9fVwiXG4gICAgICAgICAgIHt7I2lmIEByb290LmFkZEV4dHJhVGV4dEV2ZW50c319XG4gICAgICAgICAgIG9ua2V5cHJlc3M9XCJ7e3JldHVyblRleHRGaWVsZEtleVByZXNzRm55SGVscGVyIGtleX19XCJcbiAgICAgICAgICAgb25pbnB1dD1cInt7cmV0dXJuVGV4dEZpZWxkSW5wdXRGbnlIZWxwZXIga2V5fX1cIlxuICAgICAgICAgICBvbmZvY3VzPVwicmV0dXJuIGNoY2t0LnRleHRGaWVsZFNldEZvY3VzKHRoaXMsIHRydWUpXCJcbiAgICAgICAgICAgb25ibHVyPVwicmV0dXJuIGNoY2t0LnRleHRGaWVsZFNldEZvY3VzKHRoaXMsIGZhbHNlKVwiXG4gICAgICAgICAgIHt7XC9pZn19XG4gICAgICAgICAgIFwvPlxuPFwvbGFiZWw+XG5cblxuXG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cImNoZWNrYm94RmllbGRUeXBlXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWwgY2hja3QtZm9ybS1sYWJlbC0tZnVsbC13aWR0aFwiPlxuICAgIDxpbnB1dCBjbGFzcz1cImNoY2t0LWNoZWNrYm94XCIgY2hlY2tlZCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwie3trZXl9fVwiIHZhbHVlPVwidHJ1ZVwiXC8+e3shLS0gTk9URTogdmFsdWU9XFxcInRydWVcXFwiIGhlcmUgZW5zdXJlcyB0aGF0IHRoZSBjaGVja2JveCwgaWYgY2hlY2tlZCwgc2VuZHMgc3RvcmVEZXRhaWxzOlxcXCJ0cnVlXFxcIiBpbiB0aGUgcGF5bWVudERldGFpbHMgb2JqZWN0IG9mIHRoZSBwYXltZW50IGluaXRpYXRpb24gcmVxdWVzdC4gV2l0aG91dCBpdCB3ZSBzZW5kIHN0b3JlRGV0YWlsczpcXFwib25cXFwiIHdoaWNoIHRoZSBiYWNrZW5kIGRvZXNuJ3QgcmVjb2duaXNlIC0tfX1cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX3RleHRcIj5cbiAgICAgICAge3tsYWJlbH19e3sjdW5sZXNzIGxhYmVsfX17e3RyYW5zbGF0ZUhlbHBlciBrZXl9fXt7XC91bmxlc3N9fVxuICAgIDxcL3NwYW4+XG48XC9sYWJlbD5cblxuICAgICAgICA8XC9zY3JpcHQ+XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0XC90ZW1wbGF0ZSttdXN0YWNoZVwiIGRhdGEtdGVtcGxhdGU9XCJzZWxlY3RGaWVsZFR5cGVcIj5cbiAgICAgICAgXG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cImlzc3Vlckxpc3RGaWVsZFR5cGVcIj5cbiAgICAgICAge3sjaWYgaXRlbXN9fVxuICAgIDxsYWJlbCBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWwgY2hja3QtZm9ybS1sYWJlbC0tZnVsbC13aWR0aFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX3RleHRcIj57e3RyYW5zbGF0ZUhlbHBlciBcImlkZWFsSXNzdWVyLnNlbGVjdEZpZWxkLnRpdGxlXCJ9fTo8XC9zcGFuPlxuICAgICAgICA8c2VsZWN0IGNsYXNzPVwiY2hja3Qtc2VsZWN0LWJveCBqcy1jaGNrdC1pc3N1ZXItc2VsZWN0LWJveFwiIG9uY2hhbmdlPVwiY2hja3Quc2VsZWN0SXNzdWVyKHRoaXMpXCIgbmFtZT1cInt7a2V5fX1cIlxuICAgICAgICAgICAgICAgIHt7I2lmIEByb290LmFkZEV4dHJhVGV4dEV2ZW50c319XG4gICAgICAgICAgICAgICAgb25mb2N1cz1cInJldHVybiBjaGNrdC5zZWxlY3RGaWVsZFNldEZvY3VzKHRoaXMsIHRydWUpXCJcbiAgICAgICAgICAgICAgICBvbmJsdXI9XCJyZXR1cm4gY2hja3Quc2VsZWN0RmllbGRTZXRGb2N1cyh0aGlzLCBmYWxzZSlcIlxuICAgICAgICAgICAgICAgIHt7XC9pZn19XG4gICAgICAgID5cbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwbGFjZWhvbGRlclwiPnt7dHJhbnNsYXRlSGVscGVyIFwiaWRlYWxJc3N1ZXIuc2VsZWN0RmllbGQucGxhY2Vob2xkZXJcIn19PFwvb3B0aW9uPlxuICAgICAgICAgICAge3sjaXRlbXN9fVxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInt7aWR9fVwiIG5hbWU9XCJ7ey4uXC9rZXl9fVwiIGRhdGEtaXNzdWVyLWltYWdlPVwie3tpbWFnZVVybH19XCI+e3tuYW1lfX08XC9vcHRpb24+XG4gICAgICAgICAgICB7e1wvaXRlbXN9fVxuICAgICAgICA8XC9zZWxlY3Q+XG4gICAgPFwvbGFiZWw+XG57e1wvaWZ9fVxuXG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cInBheW1lbnRNZXRob2RzXCI+XG4gICAgICAgIHt7I2lmIEByb290LlNES1ZlcnNpb259fVxuICAgIDxkaXYgY2xhc3M9XCJqcy1jaGNrdC1wbV9fcG0taG9sZGVyIGNoY2t0LXBtX19wbS1ob2xkZXJcIj5cbnt7ZWxzZX19XG4gICAgPGZvcm0+XG57e1wvaWZ9fVxuXG4gICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwidHh2YXJpYW50XCIgdmFsdWU9XCJ7e3R5cGV9fVwiIFwvPlxuICAgIHt7I2lmIGlucHV0RGV0YWlsc319XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1wbV9fZGV0YWlscyBqcy1jaGNrdC1wbV9fZGV0YWlsc1wiPlxuICAgICAgICAgICAge3sjZWFjaCBpbnB1dERldGFpbHN9fVxuICAgICAgICAgICAgICAgIHt7I2lmIEBmaXJzdH19XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1mb3JtIGNoY2t0LWZvcm0tLW1heC13aWR0aFwiPlxuICAgICAgICAgICAgICAgIHt7XC9pZn19XG4gICAgICAgICAgICB7e1wvZWFjaH19XG4gICAge3tcL2lmfX1cblxuICAgIHt7I2lucHV0RGV0YWlsSGVscGVyIGlucHV0RGV0YWlsc319XG4gICAgICAgIHt7ISBQT1BVTEFURUQgRFlOQU1JQ0FMTFkgVklBICdpbnB1dERldGFpbEhlbHBlcid9fVxuICAgIHt7XC9pbnB1dERldGFpbEhlbHBlcn19XG4gICAge3sjaWYgaW5wdXREZXRhaWxzfX1cbiAgICAgICAge3sjZWFjaCBpbnB1dERldGFpbHN9fVxuICAgICAgICAgICAge3sjaWYgQGZpcnN0fX1cbiAgICAgICAgICAgICAgICA8XC9kaXY+XG4gICAgICAgICAgICB7e1wvaWZ9fVxuICAgICAgICB7e1wvZWFjaH19XG4gICAgICAgIDxcL2Rpdj5cbiAgICB7e1wvaWZ9fVxuXG57eyNpZiBAcm9vdC5TREtWZXJzaW9ufX1cbiAgICA8XC9kaXY+XG57e2Vsc2V9fVxuICAgIDxcL2Zvcm0+XG57e1wvaWZ9fVxuICAgICAgICA8XC9zY3JpcHQ+XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0XC90ZW1wbGF0ZSttdXN0YWNoZVwiIGRhdGEtdGVtcGxhdGU9XCJzZWxlY3RQYXltZW50TWV0aG9kXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1wbS1saXN0IGpzLWNoY2t0LXBtLWxpc3RcIj5cbiAgICB7e15wYXltZW50TWV0aG9kc319XG4gICAgPGRpdiBjbGFzcz1cImNoY2t0LXBtLWxpc3QtLWVtcHR5XCI+VGhlcmUgYXJlIG5vIHBheW1lbnQgbWV0aG9kcyBmb3IgeW91ciBjb21iaW5hdGlvbiBvZiBjdXJyZW5jeSBhbmQgY291bnRyeS48XC9kaXY+XG4gICAge3tcL3BheW1lbnRNZXRob2RzfX1cblxuXG4gICAge3sjcGF5bWVudE1ldGhvZHN9fVxuXG4gICAge3shIElmIHJlY3VycmluZ2RldGFpbHMgYXJlIHRoZXJlLi4uIGxvYWQgdGhlbSBmcm9tIHRoZSByZWN1cnJpbmcgb2JqZWN0IGFuZCByZXBsYWNlIHRoZSBuYW1lIHdpdGggdGhlbS4uLiB9fVxuICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1wbSBjaGNrdC1wbS17e3R5cGV9fSBqcy1jaGNrdC1wbVwiICB7eyNpbnB1dERldGFpbHNNYW5kYXRvcnlIZWxwZXIgaW5wdXREZXRhaWxzfX0ge3shIFdpbGwgYXNzZXNzIGlucHV0RGV0YWlscyBvYmplY3RzIHRvIHNlZSBpZiB0aGUgZGF0YS1hZGRpdGlvbmFsLXJlcXVpcmVkIGZsYWcgaXMgbmVlZGVkIH19IHt7XC9pbnB1dERldGFpbHNNYW5kYXRvcnlIZWxwZXJ9fSBkYXRhLXBtPVwie3t0eXBlfX1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNoY2t0LXBtX19oZWFkZXIganMtY2hja3QtcG1fX2hlYWRlclwiIG9uY2xpY2s9XCJyZXR1cm4gY2hja3Quc2VsZWN0UGF5bWVudE1ldGhvZCh0aGlzLCAne3t0eXBlfX0nKVwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiY2hja3QtcG1fX3JhZGlvLWJ1dHRvbiBqcy1jaGNrdC1wbS1yYWRpby1idXR0b25cIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwicGF5bWVudC1tZXRob2RcIiBpZD1cInt7dHlwZX19XCIgZGF0YS1jaGNrdC1zdWJtaXQtbGluaz1cInt7aHBwVXJsfX1cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtcG1fX25hbWUganMtY2hja3QtcG1fX25hbWVcIj57e3tuYW1lfX19PFwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtcG1fX2ltYWdlXCI+XG4gICAgICAgICAgICAgICAgPGltZyB3aWR0aD1cIjQwXCIgc3JjPVwie3tAcm9vdC5sb2dvQmFzZVVybH19e3sjcG1JbWFnZUhlbHBlciB0eXBlfX17e1wvcG1JbWFnZUhlbHBlcn19QDJ4LnBuZ1wiIGFsdD1cInt7bGFiZWx9fVwiIFwvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtcG1fX2ltYWdlLWJvcmRlclwiPjxcL3NwYW4+XG4gICAgICAgICAgICA8XC9zcGFuPlxuICAgICAgICA8XC9kaXY+XG4gICAgICAgIHt7PnBheW1lbnRNZXRob2RzIHNob3BwZXJMb2NhbGU9QHJvb3QucGF5bWVudC5zaG9wcGVyTG9jYWxlfX1cbiAgICA8XC9kaXY+XG4gICAge3tcL3BheW1lbnRNZXRob2RzfX1cblxuXG4gICAge3sjaWYgcGF5bWVudE1ldGhvZHN9fVxuICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1idXR0b24tY29udGFpbmVyIGpzLWNoY2t0LWJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgPGEgY2xhc3M9XCJjaGNrdC1wbS1saXN0X19idXR0b24gY2hja3QtbW9yZS1wbS1idXR0b24ganMtY2hja3QtZXh0cmEtcG1zLWJ1dHRvblwiIGRhdGEtcG09XCJleHRyYS1wbXMtYnV0dG9uXCIgdGFyZ2V0PVwiX2JsYW5rXCIgb25jbGljaz1cInJldHVybiBjaGNrdC50b2dnbGVFeGNlc3NQYXltZW50TWV0aG9kcyh0aGlzLCAnanMtY2hja3QtZXh0cmEtcG1zLWJ1dHRvbicpXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoY2t0LW1vcmUtcG0tYnV0dG9uX19pY29uXCI+KzxcL3NwYW4+PHNwYW4gY2xhc3M9XCJjaGNrdC1tb3JlLXBtLWJ1dHRvbl9fdGV4dFwiPnt7e3RyYW5zbGF0ZUhlbHBlciBcInBheW1lbnRNZXRob2RzLm1vcmVNZXRob2RzQnV0dG9uXCJ9fX08XC9zcGFuPlxuICAgICAgICA8XC9hPlxuXG4gICAgICAgIHt7I2J1dHRvbkFjdGlvbkhlbHBlcn19XG4gICAgICAgICAgICB7eyEgUE9QVUxBVEVEIERZTkFNSUNBTExZIFZJQSAnYnV0dG9uQWN0aW9uSGVscGVyJyB3aGljaCBwbGFjZXMgZWl0aGVyIHRoZSAncGF5QnV0dG9uJyBvciB0aGUgJ3Jldmlld0J1dHRvbicgdGVtcGxhdGUgaGVyZX19XG4gICAgICAgIHt7XC9idXR0b25BY3Rpb25IZWxwZXJ9fVxuICAgIDxcL2Rpdj5cbiAgICB7e1wvaWZ9fVxuXG48XC9kaXY+XG5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwicGF5bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hja3QtcHJlbG9hZGVyLWNvbnRhaW5lclwiPlxuICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1wcmVsb2FkZXJfX2JhciBjaGNrdC1wcmVsb2FkZXJfX2Jhci0tbG9hZGluZ1wiPjxcL2Rpdj5cbjxcL2Rpdj5cbnt7PnNlbGVjdFBheW1lbnRNZXRob2R9fVxuXG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cInBlbmRpbmdcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNoY2t0LXBtX19wZW5kaW5nLW1lc3NhZ2UganMtY2hja3QtcGVuZGluZy1kZXRhaWxzXCI+XG4gICAge3t0cmFuc2xhdGVIZWxwZXIgXCJwYXltZW50LnByb2Nlc3NpbmdcIn19XG48XC9kaXY+XG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cInJlZGlyZWN0LWNvbXBsZXRlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjby1jaGFyZ2UtcmVkaXJlY3RcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY28tbG9hZGVyLWJhclwiPjxcL2Rpdj5cbiAgICBZb3VyIHBheW1lbnQgaXMgYmVpbmcgcHJvY2Vzc2VkLlxuXG4gICAgPGZvcm0gbWV0aG9kPVwiZ2V0XCIgYWN0aW9uPVwie3tyZXNwb25zZS51cmx9fVwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJwYXlsb2FkXCIgdmFsdWU9XCJ7e3Jlc3BvbnNlLnBheWxvYWR9fVwiIFwvPlxuICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiQ29udGludWVcIiBcLz5cbiAgICA8XC9mb3JtPlxuPFwvZGl2PlxuICAgICAgICA8XC9zY3JpcHQ+XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0XC90ZW1wbGF0ZSttdXN0YWNoZVwiIGRhdGEtdGVtcGxhdGU9XCJyZWRpcmVjdC1kZXRhaWxzXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGNrdC1wbV9fcGVuZGluZy1tZXNzYWdlIGpzLWNoY2t0LXJlZGlyZWN0XCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1wbV9fcGVuZGluZy1kZXRhaWxzXCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJwYXltZW50LnJlZGlyZWN0aW5nXCJ9fTxcL3NwYW4+XG48XC9kaXY+XG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cImdpcm9wYXlcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cImpzLWNoY2t0LWdpcm9wYXktYmljXCIgbmFtZT1cImdpcm9wYXkuYmljXCI+XG48bGFiZWwgY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsIGNoY2t0LWZvcm0tbGFiZWwtLWZ1bGwtd2lkdGhcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX3RleHRcIj57e3RyYW5zbGF0ZUhlbHBlciBcImdpcm9wYXkuc2VhcmNoRmllbGQucGxhY2Vob2xkZXJcIn19OjxcL3NwYW4+XG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYXV0b2NvbXBsZXRlPVwiZmFsc2VcIiBjbGFzcz1cImNoY2t0LWlucHV0LWZpZWxkXCIgaWQ9XCJqcy1jaGNrdC1naXJvcGF5LWlucHV0LWZpZWxkXCIgcGxhY2Vob2xkZXI9XCJ7e3RyYW5zbGF0ZUhlbHBlciAnZ2lyb3BheS5taW5pbXVtTGVuZ3RoJ319XCIgb25rZXl1cD1cImNoY2t0Lmdpcm9QYXlMb29rdXAoZXZlbnQsIHRoaXMsICd7e0Byb290Lm9yaWdpbktleX19JywgJ3t7Z2lyb1BheUlzc3VlcnNVcmx9fScpXCJcLz5cbjxcL2xhYmVsPlxuPGxhYmVsIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbCBjaGNrdC1mb3JtLWxhYmVsLS1mdWxsLXdpZHRoXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX190ZXh0XCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJnaXJvcGF5LnNlYXJjaEZpZWxkLnBsYWNlaG9sZGVyXCJ9fTo8XC9zcGFuPlxuICAgIDxzZWxlY3QgY2xhc3M9XCJjaGNrdC1wbV9fZ2lyb3BheS1zdWdnZXN0aW9uc1wiIHNpemU9XCI0XCIgaWQ9XCJqcy1jaGNrdC1naXJvcGF5LXN1Z2dlc3Rpb24tbGlzdFwiPlxuICAgICAgICA8b3B0aW9uIGRpc2FibGVkIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbF9faGVscGVyXCI+XG4gICAgICAgICAgICBEZXV0c2NoZSBCYW5rIFBHSyBCZXJsaW4gMTA4ODMgQmVybGluICgxMDA3MDAyNCBcLyBERVVUREVEQkJFUilcbiAgICAgICAgPFwvb3B0aW9uPlxuICAgIDxcL3NlbGVjdD5cbjxcL2xhYmVsPlxuXG5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwiY2FyZEZpZWxkVHlwZVJlY3VycmluZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hja3QtcG1fX3JlY3VycmluZy1kZXRhaWxzXCI+XG4gICAgPGxhYmVsIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbCBjaGNrdC1mb3JtLWxhYmVsLS1leHAtZGF0ZVwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX3RleHRcIj57e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLmV4cGlyeURhdGVGaWVsZC50aXRsZVwifX19OjxcL3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtaW5wdXQtZmllbGQgY2hja3QtaW5wdXQtZmllbGQtLXJlY3VycmluZ1wiIGRhdGEtY3NlPVwie3trZXl9fVwiPnt7cmVjdXJyaW5nLmV4cGlyeU1vbnRofX1cL3t7cmVjdXJyaW5nLmV4cGlyeVllYXJ9fTxcL3NwYW4+XG4gICAgPFwvbGFiZWw+XG4gICAgPGxhYmVsIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbCBjaGNrdC1mb3JtLWxhYmVsLS1jdmNcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX190ZXh0IGpzLWNoY2t0LWN2Yy1maWVsZC1sYWJlbFwiPnt7dHJhbnNsYXRlSGVscGVyIFwiY3JlZGl0Q2FyZC5jdmNGaWVsZC50aXRsZVwifX06PFwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1pbnB1dC1maWVsZCBjaGNrdC1pbnB1dC1maWVsZC0tY3ZjIGpzLWNoY2t0LWhvc3RlZC1pbnB1dC1maWVsZFwiIGRhdGEtaG9zdGVkLWlkPVwiaG9zdGVkU2VjdXJpdHlDb2RlRmllbGRcIiBkYXRhLWNzZT1cInt7a2V5fX1cIiBkYXRhLW9wdGlvbmFsPVwie3tvcHRpb25hbH19XCI+PFwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX19lcnJvci10ZXh0XCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLm9uZUNsaWNrVmVyaWZpY2F0aW9uLmludmFsaWRJbnB1dC50aXRsZVwifX08XC9zcGFuPlxuICAgIDxcL2xhYmVsPlxuXG4gICAge3shLS08bGFiZWwgY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsIGNoY2t0LWZvcm0tLWxhYmVsaG9sZGVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbF9fdGV4dCBqcy1jaGNrdC1ob2xkZXItZmllbGQtbGFiZWxcIj57e3t0cmFuc2xhdGVIZWxwZXIgXCJjYXJkaG9sZGVyX25hbWVcIn19fTo8XC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWlucHV0LWZpZWxkIGpzLWNoY2t0LWhvc3RlZC1pbnB1dC1maWVsZFwiIGRhdGEtaG9zdGVkLWlkPVwiaG9zdGVkSG9sZGVyRmllbGRcIiBkYXRhLWNzZT1cInt7a2V5fX1cIj48XC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX2Vycm9yLXRleHRcIj48XC9zcGFuPlxuICAgIDxcL2xhYmVsPi0tfX1cbjxcL2Rpdj5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwiZXJyb3JcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNoY2t0LXBtX19wZW5kaW5nLW1lc3NhZ2UgY2hja3QtcG1fX2Vycm9yLW1lc3NhZ2UganMtY2hja3QtZXJyb3JcIj5cbiAgICB7e3RyYW5zbGF0ZUhlbHBlciBcImVycm9yLnN1YnRpdGxlLnBheW1lbnRcIn19OiB7e21lc3NhZ2V9fVxuPFwvZGl2PlxuICAgICAgICA8XC9zY3JpcHQ+XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0XC90ZW1wbGF0ZSttdXN0YWNoZVwiIGRhdGEtdGVtcGxhdGU9XCJwYXlCdXR0b25cIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjaGNrdC1idXR0b24gY2hja3QtcG0tbGlzdF9fYnV0dG9uIGNoY2t0LWJ1dHRvbi0tc3VibWl0IGpzLWNoY2t0LWJ1dHRvbi0tc3VibWl0XCIgb25jbGljaz1cImNoY2t0LnN1Ym1pdFBheW1lbnRGb3JtKHRydWUsIGV2ZW50KVwiPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtYnV0dG9uX190ZXh0LWNvbnRlbnRcIj5cbiAgICAgICAge3sjaWYgcGF5bWVudC5hbW91bnQudmFsdWV9fVxuICAgICAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWJ1dHRvbl9fdGV4dFwiPnt7dHJhbnNsYXRlSGVscGVyIFwicGF5QnV0dG9uXCJ9fTxcL3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtYnV0dG9uX19hbW91bnRcIj57e2dldExvY2FsaXNlZEFtb3VudEhlbHBlciBAcm9vdC5wYXltZW50LmFtb3VudC52YWx1ZSBAcm9vdC5wYXltZW50LnNob3BwZXJMb2NhbGUgQHJvb3QucGF5bWVudC5hbW91bnQuY3VycmVuY3l9fTxcL3NwYW4+XG4gICAgICAgIHt7ZWxzZX19XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtYnV0dG9uX190ZXh0XCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJwYXlCdXR0b25cIn19PFwvc3Bhbj5cbiAgICAgICAge3tcL2lmfX1cbiAgICA8XC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtYnV0dG9uX19sb2FkaW5nLWljb25cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNpcmNsZTFcIj48XC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaXJjbGUyXCI+PFwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2lyY2xlM1wiPjxcL2Rpdj5cbiAgICA8XC9zcGFuPlxuPFwvYnV0dG9uPlxuICAgICAgICA8XC9zY3JpcHQ+XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0XC90ZW1wbGF0ZSttdXN0YWNoZVwiIGRhdGEtdGVtcGxhdGU9XCJyZXZpZXdCdXR0b25cIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjaGNrdC1idXR0b24gY2hja3QtcG0tbGlzdF9fYnV0dG9uIGNoY2t0LWJ1dHRvbi0tc3VibWl0IGpzLWNoY2t0LWJ1dHRvbi0tc3VibWl0XCIgb25jbGljaz1cImNoY2t0LnN1Ym1pdFBheW1lbnRGb3JtKGZhbHNlLCBldmVudClcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWJ1dHRvbl9fdGV4dFwiPlJldmlldyBvcmRlcjxcL3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1idXR0b25fX2xvYWRpbmctaWNvblwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2lyY2xlMVwiPjxcL2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNpcmNsZTJcIj48XC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaXJjbGUzXCI+PFwvZGl2PlxuICAgIDxcL3NwYW4+XG48XC9idXR0b24+XG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cImNhcmRGaWVsZENhcmROdW1iZXJcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbCBjaGNrdC1mb3JtLWxhYmVsLS1mdWxsLXdpZHRoXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX190ZXh0IGpzLWNoY2t0LWNhcmQtbGFiZWxcIiBvbmNsaWNrPVwiY2hja3Quc2V0Rm9jdXNPbkZpZWxkKHRoaXMsIHRydWUpXCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLm51bWJlckZpZWxkLnRpdGxlXCJ9fTo8XC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtaW5wdXQtZmllbGQganMtY2hja3QtaG9zdGVkLWlucHV0LWZpZWxkXCIgZGF0YS1ob3N0ZWQtaWQ9XCJob3N0ZWRDYXJkTnVtYmVyRmllbGRcIiBkYXRhLWNzZT1cInt7a2V5fX1cIj48XC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbF9fZXJyb3ItdGV4dFwiPnt7dHJhbnNsYXRlSGVscGVyIFwiY3JlZGl0Q2FyZC5udW1iZXJGaWVsZC5pbnZhbGlkXCJ9fTxcL3NwYW4+XG48XC9sYWJlbD5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwiY2FyZEZpZWxkRXhwaXJ5RGF0ZVwiPlxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsIGNoY2t0LWZvcm0tbGFiZWwtLWV4cC1kYXRlXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX190ZXh0XCIgb25jbGljaz1cImNoY2t0LnNldEZvY3VzT25GaWVsZCh0aGlzLCB0cnVlKVwiPnt7dHJhbnNsYXRlSGVscGVyIFwiY3JlZGl0Q2FyZC5leHBpcnlEYXRlRmllbGQudGl0bGVcIn19OjxcL3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1pbnB1dC1maWVsZCBqcy1jaGNrdC1ob3N0ZWQtaW5wdXQtZmllbGRcIiBkYXRhLWhvc3RlZC1pZD1cImhvc3RlZEV4cGlyeURhdGVGaWVsZFwiIGRhdGEtY3NlPVwie3trZXl9fVwiPjxcL3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX19lcnJvci10ZXh0XCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLmV4cGlyeURhdGVGaWVsZC5pbnZhbGlkXCJ9fTxcL3NwYW4+XG48XC9sYWJlbD5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwiY2FyZEZpZWxkRXhwaXJ5TW9udGhcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbCBjaGNrdC1mb3JtLWxhYmVsLS1leHAtbW9udGhcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX3RleHRcIiBvbmNsaWNrPVwiY2hja3Quc2V0Rm9jdXNPbkZpZWxkKHRoaXMsIHRydWUpXCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLmV4cGlyeURhdGVGaWVsZC5tb250aFwifX06PFwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWlucHV0LWZpZWxkIGpzLWNoY2t0LWhvc3RlZC1pbnB1dC1maWVsZFwiIGRhdGEtaG9zdGVkLWlkPVwiaG9zdGVkRXhwaXJ5TW9udGhGaWVsZFwiIGRhdGEtY3NlPVwie3trZXl9fVwiIG5hbWU9XCJ7e2tleX19XCI+PFwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX2Vycm9yLXRleHRcIj57e3RyYW5zbGF0ZUhlbHBlciBcImNyZWRpdENhcmQuZXhwaXJ5RGF0ZUZpZWxkLmludmFsaWRcIn19PFwvc3Bhbj5cbjxcL2xhYmVsPlxuICAgICAgICA8XC9zY3JpcHQ+XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0XC90ZW1wbGF0ZSttdXN0YWNoZVwiIGRhdGEtdGVtcGxhdGU9XCJjYXJkRmllbGRFeHBpcnlZZWFyXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWwgY2hja3QtZm9ybS1sYWJlbC0tZXhwLXllYXJcIj5cbiAgICA8c3BhbiBjbGFzcz1cImNoY2t0LWZvcm0tbGFiZWxfX3RleHRcIiBvbmNsaWNrPVwiY2hja3Quc2V0Rm9jdXNPbkZpZWxkKHRoaXMsIHRydWUpXCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLmV4cGlyeURhdGVGaWVsZC55ZWFyXCJ9fTo8XC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtaW5wdXQtZmllbGQganMtY2hja3QtaG9zdGVkLWlucHV0LWZpZWxkXCIgZGF0YS1ob3N0ZWQtaWQ9XCJob3N0ZWRFeHBpcnlZZWFyRmllbGRcIiBkYXRhLWNzZT1cInt7a2V5fX1cIj48XC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbF9fZXJyb3ItdGV4dFwiPnt7dHJhbnNsYXRlSGVscGVyIFwiY3JlZGl0Q2FyZC5leHBpcnlEYXRlRmllbGQuaW52YWxpZFwifX08XC9zcGFuPlxuPFwvbGFiZWw+XG4gICAgICAgIDxcL3NjcmlwdD5cblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHRcL3RlbXBsYXRlK211c3RhY2hlXCIgZGF0YS10ZW1wbGF0ZT1cImNhcmRGaWVsZFNlY3VyaXR5Q29kZVwiPlxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsIGNoY2t0LWZvcm0tbGFiZWwtLWN2Y1wiPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbF9fdGV4dCBqcy1jaGNrdC1jdmMtZmllbGQtbGFiZWxcIiBvbmNsaWNrPVwiY2hja3Quc2V0Rm9jdXNPbkZpZWxkKHRoaXMsIHRydWUpXCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLmN2Y0ZpZWxkLnRpdGxlXCJ9fTo8XC9zcGFuPlxuICAgIDxzcGFuIGNsYXNzPVwiY2hja3QtaW5wdXQtZmllbGQgY2hja3QtaW5wdXQtZmllbGQtLWN2YyBqcy1jaGNrdC1ob3N0ZWQtaW5wdXQtZmllbGRcIiBkYXRhLWhvc3RlZC1pZD1cImhvc3RlZFNlY3VyaXR5Q29kZUZpZWxkXCIgZGF0YS1jc2U9XCJ7e2tleX19XCIgZGF0YS1vcHRpb25hbD1cInt7b3B0aW9uYWx9fVwiPjxcL3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJjaGNrdC1mb3JtLWxhYmVsX19lcnJvci10ZXh0XCI+e3t0cmFuc2xhdGVIZWxwZXIgXCJjcmVkaXRDYXJkLm9uZUNsaWNrVmVyaWZpY2F0aW9uLmludmFsaWRJbnB1dC5tZXNzYWdlXCJ9fTxcL3NwYW4+XG48XC9sYWJlbD5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dFwvdGVtcGxhdGUrbXVzdGFjaGVcIiBkYXRhLXRlbXBsYXRlPVwiYXBwbGVwYXlcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hja3QtZm9ybS1sYWJlbCBjaGNrdC1mb3JtLWxhYmVsLS1mdWxsLXdpZHRoXCI+XG4gICAgPGlucHV0IGNsYXNzPVwiY2hja3QtYXBwbGVwYXlcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInt7a2V5fX1cIiBvbmNsaWNrPVwiY2hja3QuYXBwbGVQYXlCdXR0b25DbGlja2VkKCd7e2hfbWVyY2hhbnRJZGVudGlmaWVyfX0nKVwiIFwvPlxuPFwvbGFiZWw+XG5cbiAgICAgICAgPFwvc2NyaXB0PlxuXG4gICAgICAgICAgICAgICAgPG5vc2NyaXB0IGlkPVwiY28tMTUzNjA2NjE1NDkzNC0zODgtc3NyXCI+XG4gICAgICAgIFRlbXBsYXRlICdwYXltZW50JyBub3QgZm91bmQuXG4gICAgICAgIDxcL25vc2NyaXB0PlxuICAgIDxcL2Rpdj5cbjxcL2Rpdj5cblxuXG5cblxuXG4iLCJpbml0aWF0aW9uVXJsIjoiaHR0cHM6XC9cL2NoZWNrb3V0c2hvcHBlci10ZXN0LmFkeWVuLmNvbVwvY2hlY2tvdXRzaG9wcGVyXC9zZXJ2aWNlc1wvUGF5bWVudEluaXRpYXRpb25cL3YxXC9pbml0aWF0ZT90b2tlbj1wdWIudjIuNzgxNDI1MzA0NTYyMDU5NS5hSFIwY0RvdkwyeHZZMkZzYUc5emRBLmQ4bXRmR09JeEZEeHhvTWotRVQ5dkltb3JEcHdJN2VzXy1xaHRoTzR4TnMiLCJvbmVDbGlja1BheW1lbnRNZXRob2RzIjpbeyJkZXRhaWxzIjpbeyJrZXkiOiJlbmNyeXB0ZWRTZWN1cml0eUNvZGUiLCJ0eXBlIjoiY2FyZFRva2VuIn1dLCJncm91cCI6eyJuYW1lIjoiQ3JlZGl0IENhcmQiLCJwYXltZW50TWV0aG9kRGF0YSI6IkFiMDJiNGMwIUJRQUJBZ0JScEk3WHcxYUdnS013OTQ5MWFrMkh0OTdhbHJtU3lJNnlNd0w3Q3RtaFFQaFZwdFZnN2NnRzBJRmhVcUdyTGptbjJPSDRnWnNIOTgwMHNCODVPaW5BNDdXVnZIdW85ZmFPZTVQNXRwRERMbUJXeTc2MWVFWnhuSmpiK0FpXC9cL0UybzlLYVFSM1hNSmt3TlNLYXhjc1wvVDh1S0FDVkFIU2pUYXRFQjc2YU1xclV6MVJCSVFrQkYrRmtBcnE5cHVKNlRSYkNNTVNjbjFVUjM2TWZWUjFUNWZFQ1c5eXdJSkNMdk9tb2k0WTdLYXUxTkdDaHdsODFvVzRaWml4cFlKSzZSblJNQVZVNXZoVVliN0RQNVlMSnRWdzJxZ2VLOWlpWjZhbDJIZ1g2ZFwva2E5aTlVMEtFbHlhdzBxazU2M3ZSQ2VZekNsSkY4NzBYQUtsUEJRMnNyM2hzblVJZVdjRXZLelZ1elZUY25DSW5mdlNGVmRYVVF4bVRpdXlMSVJpNkpJUiszK3Q4bEJYUGEyVCtQREZ3MHNTazE3Uk5zVHdDRHlcL3ZjV1wvRllhWGxpOWlVcjRqbVladDcxZ2tRTzJpSFd5ZVpsXC9YbmFrenFpWDE3bVJ4OHFcL1J6OFR6M1hRMHA1cmhHQVBpdXREcmJ1TUh5dG9PT3hZeEMxT0lCRW4wRGUzcmZLSUk5dGJtYTVPSWQ2MzVqRFNiVlF6eXdDK29oOVVFS1ZNUmtCelBxeFVcLzc0UEU4UkxnXC9Sd1ByYlp0ZXhEVHBEZEhKK0cydFZHdW5HUm1NZEM5NUNPK2s4VXBCaUJEVlZ5Wk1HcHNmdlVyTW1CMFE2Z0duV2Z3aGdFakI2ZFpcL081elBJbm1ReWk1NVNnXC80SkdjblgxTXI3MURVUm9xdE5lYzErU002eEM3ekdkaTRpa1FNRmcwblViNUJEa3FBRXA3SW10bGVTSTZJa0ZHTUVGQlFURXdNME5CTlRNM1JVRkZSRGczUXpJMFJFUTFNemt3T1VJNE1FRTNPRUU1TWpORk16Z3lNMFEyT0VSQlEwTTVORUk1UmtZNE16QTFSRU1pZmFpUUxteE9ySFh4NTVcL2gwVDhpcGZiTmVDd3lZVXYzWWc4blpmeWhyWDFabHRYK0xFdXI5dXplQVJHY09ScFBcL0kySTB2ND0iLCJ0eXBlIjoiY2FyZCJ9LCJuYW1lIjoiVklTQSIsInBheW1lbnRNZXRob2REYXRhIjoiQWIwMmI0YzAhQlFBQkFnQ0VxUENQQllGNHNPUWRyRUd6M1d3end4bFhyQ1lQUjdaY0pVeVMrditoWDRhbDNmM2s5ZDlDc0M1YXV3aGk0NHZ5M1BWMTR0MlZvNlJlU2swYnZCM05LYTBrNkd6S1VyTWtKVkIxRGppaWhQWjRrMHVnSDQzVTY4RjRBZUZyWkxmeDhWOVc5Qm5HOWZ1U0EzXC9Bam1mZXFzbDhJQkVhbFNWaWpaT0FTY29WeThxUU5QVTV5TGxoTktcL0dUYmhWUjE2RVQ1alVobEc0ejBxR2NmT2xiQkd6VlIyWHJQTm5JcTJTWkpTNEQ1bDROamU5NUladHR5eU84Z05ORVVjTEJ2UVJjRFwvdzJBYWdKaU9raHk1TXNuNkxSZlc3NWwzK25mZUlRb1hXakxyWm1tY0ZFV1JpbEp1d1BDRHI0WmJhUVAwTmkyS2Jvd3FZZDJUQTl4ZkNrclAwY3JZRXM0cWtPR2c3aWtSUU9SQ2VBY2NxdWFjNHphelptM3FFbkJcLzA5ZEZjS21nMk9pRk5LYWRQZEJTZU9xOFNESXBsRHZUMURDZHRlWWFQaFFKd1o5TlorZzNpNUNmQ1BEa2lvdk81NDBDOWlDd1wvSzhCSm5yRmp4MVFvU1JWeld4XC9iZmYycGduMGFvZHcyVGhWTVdMaGhpREtNaEJ2SnRLZzZuVW1tTDNoRFJNNGtMUUlLYXN6SWtpWXJzZjk3eXlBZGtKbjE1VFV1RjU4N1cwcU04Z1N0SU5KM0E3Q2QxZ0ExZ1BkTHduZnVcLzFseW96UFBkdkZLUDdVNEpBdmRlblZUU3QyeHBCRTRIdGVnQ0NlYzJvdGpvXC9hTTJNTjFxMW5NUVhhVXVualBMUEV0UkNHNUNEN0NkOTlEeEF4UCtNSk5iQTJ3b3Y2RmNmS1J6bEVHY1JEV3lJaXRkZ0pPRDVlWkdNd1ViOFB0QUVwN0ltdGxlU0k2SWtGR01FRkJRVEV3TTBOQk5UTTNSVUZGUkRnM1F6STBSRVExTXprd09VSTRNRUUzT0VFNU1qTkZNemd5TTBRMk9FUkJRME01TkVJNVJrWTRNekExUkVNaWZUZHpLMVVwNkwzZ2RUTVwvUWlVTDhJbmVvZFRkUXhsT0dWWTVNdERrT1hoTTNcL3BqelpDXC82aEFPcW1sb2tsTEVFYVpWc3dqZEtHcVFvWXBLeXMyVUhBT2JPcFV4K0RyOE53Ym85cW5RZ0NFclR4VVNSS2dCU1hZdkdNcUUiLCJ0eXBlIjoidmlzYSIsInN0b3JlZERldGFpbHMiOnsiY2FyZCI6eyJleHBpcnlNb250aCI6IjEwIiwiZXhwaXJ5WWVhciI6IjIwMjAiLCJob2xkZXJOYW1lIjoiQ2hlY2tvdXQgU2hvcHBlciBQbGFjZUhvbGRlciIsIm51bWJlciI6IjExMTEifX19XSwib3JpZ2luIjoiaHR0cDpcL1wvbG9jYWxob3N0Iiwib3JpZ2luS2V5IjoicHViLnYyLjc4MTQyNTMwNDU2MjA1OTUuYUhSMGNEb3ZMMnh2WTJGc2FHOXpkQS5kOG10ZkdPSXhGRHh4b01qLUVUOXZJbW9yRHB3STdlc18tcWh0aE80eE5zIiwicGF5bWVudCI6eyJhbW91bnQiOnsiY3VycmVuY3kiOiJHQlAiLCJ2YWx1ZSI6MTIwMjV9LCJjb3VudHJ5Q29kZSI6IkdCIiwicmVmZXJlbmNlIjoiSE5CT3JkZXIwMDEiLCJyZXR1cm5VcmwiOiJodHRwOlwvXC9sb2NhbGhvc3RcL2Fzc2V0c1wvaW5kZXguaHRtbCMhXC9jaGVja291dCIsInNlc3Npb25WYWxpZGl0eSI6IjIwMTgtMDktMDRUMTQ6MDI6MzRaIiwic2hvcHBlckxvY2FsZSI6ImVuX0dCIiwic2hvcHBlclJlZmVyZW5jZSI6InlvdXJTaG9wcGVySWRfSU9mVzNrOUcyUHZYRnUyaiJ9LCJwYXltZW50RGF0YSI6IkFiMDJiNGMwIUJRQUJBZ0IwY29nQWVKR0VRNlJMeWpuZmVIWWIxclpKTnhTYUFvVFRpMDZSc2dNQXNuWGV4MVVpZnAzK1RXbWRLT3VhQ1g2THdyckxpZk9nWXk2eHlnUW1UcnBEczdvZG5ST1RZbXFBcUlUQmg0MWVicjN1NEdxWEkxQUl3ckY5amdjM2Z4ZUFGXC9vcTk5N0dcL1ArNVBZMDRIekd2V2oxYlBhTTFJUDNpY1B5UStxY0cydGlHTllYekw3dldQazRIaXh3b2FzbTlBTlViNkR1aVE4QktRU2M5bTgzcmhWNEU1K1wvYnpaKzlkZ1FyM3dcL0ZxdjVYN1Nud1k0NWNQUSt5YnB4cFZaN3RONWZ1UmxMdG0xblBnVVZTSjN5ZmJwVG9DQ3JNcVJsTzhCeTVvMUZQUVlJaVRCTTduakNvQmhoMmUyRzNCa1B2eXhCN1p1QmZhWVpZbUhiOCtmRklDTG53MmlSaFN6TUJaMGdjNDBBQWFva3FkXC9seTZwWUcrRlFWbVFaYkJOVERrdkdiaFNHZGRWdTFRTVpSZnZtMERMUHVIblZ2S1wvOU94Nm9pVHRpelk4U2t2d2FZQ2F4UUNZQVBMVWR0RnhNS0VcL3VQdU9VeTJoY1FxMnJVV0M0c1NZbmtlTE9tcFpqOHQrcSsrd0ZwRm82RUg0RCtvVkR3NFlZTXgrajI2XC9sQU5XZnBBODAxbXQxckc2ZWR1ekNUU1FIVE9zU0V5Q2poUk5xZnJwNEZcL1lZd0VFdm1vVDBEbHJcLzh6bG5oQXhxT2Z1MUdpaG1sejZnQWJQVnBYM1NSZkdJVThMYnk2SEdSeHd1Z1hleHdKbFhTOWZ0ejBraHZCa0J5eDRxQjJzVmVcL1ZHd3NUdFFHd2tmRTFnb29EQVRLWWYya2FYVGQrZUNHT1JuMUxtWVJSRGRBZERVKzgyZnphSEFHWlNQbVwvaVJBRXA3SW10bGVTSTZJa0ZHTUVGQlFURXdNME5CTlRNM1JVRkZSRGczUXpJMFJFUTFNemt3T1VJNE1FRTNPRUU1TWpORk16Z3lNMFEyT0VSQlEwTTVORUk1UmtZNE16QTFSRU1pZlNOYmtFU2xNdEhDQzcwWU9zWUtpSG54bTFTRDFGRFJ2WGhxVlVYOExrdzdtbzFkd1RXc3pNSTE2R1dhUjZ5d0lGamdHWTFyT2ZCbmZWV2g1Ymx3UFdGV2R0clZPalp4RXE2K3Iza2lWdHE0eXNiMHdSS05vVjI1TThBMkZKRlI1ZjZsU1cybGVZWW9VYjJFa0dDakV0UWMySW8zbXEzdURDWkhNRitwQnNkTUJJbWxUVngrdEN6MjBYejd2NmZcL1g2Y202SFRYMEprUzhhY2dpVlRZWnl0SWtTOWg4MnQ3bUF1NHZ0Z25pMTNFOWdITG1HTVlYcXFyN2grQ0RzQ2txY2xITnlEQkxic1ErMUhLblRSOWtGdEdDT3JQbHl5VUIrMTRYTlhwQWxlSnZpbjFLb01LQ3VyT0VMWVQ1Qmpvem93OW5kRjdFdkJhd3psVFlEWFlSM3ZuXC92eEpzZGF3Vk11em5pVUhjK01SeFlOVjFEdjE2ckxEeTdYU0w1M1dobWlqTThMOXFuXC90VWJzcERrYkRBRWJ6QXdvdlc1em82WURXNWp1TGxoZk8rYkRTdWF5VExcLzBHNVdiUjVHM1hlaWgxRDQ1MExQcWdudjVsVTdJaTBNT1hjVVdBNjE4aG9jd3drWEhnUkE4R2ZEMExBR3hZb3RZQ0NlaHlmWnA4RTJXamJmVVpUUjlQazNrM0NVbUxnMEQxbU1DTlorY04ycUxISHdIeGhielJ6cGdWQ0E5NlUwMkFHMklNQVZrMTV5cXlWdkUzcUk5Q29GQ0REelNiNHdvYnhrMUwyejJUeVZvMHFUSVBKYkJBNURQNjBMNEJuUm8zdDFMdWVyNmlXZlRJXC9xMFpTSGdSeVZ1YlwvZE8rRXZ4bjBYZ0R4VGhFSHZXZ21KNFFON0N5dEhQc2t2UVBpajFQakpaK1N6eFhYK21OaFZvdTduVnlVSllIdmhSdTJNNXlyVUhPZVlkV3ZlMUhuTHNuc05WUHNTT1o5cjZ6cUxvR0lQZmE0eWpWbFZMdjMzYTJHN2lSN2swSmhKZlpjejZGUTRuaXNkTitmVXZldnVacWRkbGVvQjlGNnBjTU1ueFhUUnhwYjZLWkhSMFwvczNTWG9uMXhjczVhN0ladlRzT0hhdzFcL3krZU1jTnBySUJ2a2lQM3J2UEFiRlpiVVFJXC92RHBVWkJaUzVpbGFObzMxTFVKOTVKTWQ1SDUxeXJjTXJYZ3Z0Y1JrPSIsInBheW1lbnRNZXRob2RzIjpbeyJkZXRhaWxzIjpbeyJrZXkiOiJlbmNyeXB0ZWRDYXJkTnVtYmVyIiwidHlwZSI6ImNhcmRUb2tlbiJ9LHsia2V5IjoiZW5jcnlwdGVkU2VjdXJpdHlDb2RlIiwidHlwZSI6ImNhcmRUb2tlbiJ9LHsia2V5IjoiZW5jcnlwdGVkRXhwaXJ5TW9udGgiLCJ0eXBlIjoiY2FyZFRva2VuIn0seyJrZXkiOiJlbmNyeXB0ZWRFeHBpcnlZZWFyIiwidHlwZSI6ImNhcmRUb2tlbiJ9LHsia2V5IjoiaG9sZGVyTmFtZSIsIm9wdGlvbmFsIjp0cnVlLCJ0eXBlIjoidGV4dCJ9LHsia2V5Ijoic3RvcmVEZXRhaWxzIiwib3B0aW9uYWwiOnRydWUsInR5cGUiOiJib29sZWFuIn1dLCJncm91cCI6eyJuYW1lIjoiQ3JlZGl0IENhcmQiLCJwYXltZW50TWV0aG9kRGF0YSI6IkFiMDJiNGMwIUJRQUJBZ0JScEk3WHcxYUdnS013OTQ5MWFrMkh0OTdhbHJtU3lJNnlNd0w3Q3RtaFFQaFZwdFZnN2NnRzBJRmhVcUdyTGptbjJPSDRnWnNIOTgwMHNCODVPaW5BNDdXVnZIdW85ZmFPZTVQNXRwRERMbUJXeTc2MWVFWnhuSmpiK0FpXC9cL0UybzlLYVFSM1hNSmt3TlNLYXhjc1wvVDh1S0FDVkFIU2pUYXRFQjc2YU1xclV6MVJCSVFrQkYrRmtBcnE5cHVKNlRSYkNNTVNjbjFVUjM2TWZWUjFUNWZFQ1c5eXdJSkNMdk9tb2k0WTdLYXUxTkdDaHdsODFvVzRaWml4cFlKSzZSblJNQVZVNXZoVVliN0RQNVlMSnRWdzJxZ2VLOWlpWjZhbDJIZ1g2ZFwva2E5aTlVMEtFbHlhdzBxazU2M3ZSQ2VZekNsSkY4NzBYQUtsUEJRMnNyM2hzblVJZVdjRXZLelZ1elZUY25DSW5mdlNGVmRYVVF4bVRpdXlMSVJpNkpJUiszK3Q4bEJYUGEyVCtQREZ3MHNTazE3Uk5zVHdDRHlcL3ZjV1wvRllhWGxpOWlVcjRqbVladDcxZ2tRTzJpSFd5ZVpsXC9YbmFrenFpWDE3bVJ4OHFcL1J6OFR6M1hRMHA1cmhHQVBpdXREcmJ1TUh5dG9PT3hZeEMxT0lCRW4wRGUzcmZLSUk5dGJtYTVPSWQ2MzVqRFNiVlF6eXdDK29oOVVFS1ZNUmtCelBxeFVcLzc0UEU4UkxnXC9Sd1ByYlp0ZXhEVHBEZEhKK0cydFZHdW5HUm1NZEM5NUNPK2s4VXBCaUJEVlZ5Wk1HcHNmdlVyTW1CMFE2Z0duV2Z3aGdFakI2ZFpcL081elBJbm1ReWk1NVNnXC80SkdjblgxTXI3MURVUm9xdE5lYzErU002eEM3ekdkaTRpa1FNRmcwblViNUJEa3FBRXA3SW10bGVTSTZJa0ZHTUVGQlFURXdNME5CTlRNM1JVRkZSRGczUXpJMFJFUTFNemt3T1VJNE1FRTNPRUU1TWpORk16Z3lNMFEyT0VSQlEwTTVORUk1UmtZNE16QTFSRU1pZmFpUUxteE9ySFh4NTVcL2gwVDhpcGZiTmVDd3lZVXYzWWc4blpmeWhyWDFabHRYK0xFdXI5dXplQVJHY09ScFBcL0kySTB2ND0iLCJ0eXBlIjoiY2FyZCJ9LCJuYW1lIjoiVklTQSIsInBheW1lbnRNZXRob2REYXRhIjoiQWIwMmI0YzAhQlFBQkFnQ3dVb0p2akRBc0pSc1VhdldmRU45UklEbkkxZDJlT3Fjcjl6eW9xMTNpekZkN04xNk44YzJBWWxDN0plcStTQUJaRWRNejZQSU5Bem5XSWloVlVzcUNMUzVlWGI5dWlXaUEyRGpXR3p1OXJldW1rbXBReGlJdlJEZUhZSkRXMDNcL3N4VGc1MGxRVXB4WmlzQlhob0l0TFwvVHVcLzduN2ZHK0Q1SysyUXJrZWRTZjg2MFliYmtnZ2FGYmZmUFB0OWV5djcwdFdlNWZXa0Ftd3Y2R1V6MnRFUStJY1NWTXdCckpPUWtWT0ZabjZUOFpIQlZubk1iNWVXXC9iYUVZMTAwTE9GdXMyZFJEQnp4OVc5ZzNISkxcL1Rib29KKzE2QzlPbG4rdjRmSHdjK1wvZSt3RTFtSUlsaUFyK0Q4R3F4dURIWFU0NEhFUjVaaUVcL0FqWCtUMlhqK2lHU0h4amtXM0p2UnlmZlZ5TG5CSmpJcGx5OTd6VHBrUEp5UzZjQXFiK2Q1Q0txeGhNVkFRa3RlWWNiSUtqcWR1amJzdHN0QTM5ZWltaG5FWFdERFQ3elFpYzZjdTVFeTlhb3A1YmhcL1BlNUQ2cllUZjF4clUwZ2I3aWZMRGJydUpRZngyK3g5RFIySmJPbHRjRkI3WURONVkzOHFqRjRnYm5vempkemNmTUNzZ1hJTlBkNlNMM2VWcklhSnZYeExlSnJYMjJhUGJFK2dcL3l5TE9CMHJ5cXloRGttSElZQmg4RTZQYXNjemhNcEVUdEhYVDdMdEp1ZHRTc2dVeFwvdXhBZFwvTXpZVTFnMk5FMXhiVUp6SXlMXC91ZXQrSFNkUHcrWnlUQWFDaFJzdVwva3FvWkF5Z2diMjM2VmZhT3pSZEZrWWJBNUl6SlVqQ0dleWJOUHFRYnZzdk9FUkEzNnkxbzlSRDY1bFkzU3J2SkFtZVlBRXA3SW10bGVTSTZJa0ZHTUVGQlFURXdNME5CTlRNM1JVRkZSRGczUXpJMFJFUTFNemt3T1VJNE1FRTNPRUU1TWpORk16Z3lNMFEyT0VSQlEwTTVORUk1UmtZNE16QTFSRU1pZmZkRnY1RXlaWEFab2cxOFRRY1wvakx1cDh6Z2FlVFZrNnMzcGNieGRONXRFOU12MGFUWXAwYW9XdVk5b2lsSzY0aVJhIiwidHlwZSI6InZpc2EifV0sInB1YmxpY0tleSI6IjEwMDAxfDkwQkU2QTRFMzcyREVENDQ4ODcxMzhENUIxNkU5ODkzMUE1NkNGMUNERUNDNjEzMUNGMzM0ODU1ODZERjlERTE2NDM3QTlEMjgwNUM5NzQ3QzY3RTAwNzMzMDAwQTMyMkU1MEE3NThGRDg4NjJEQTRENzBGRDA5MUZDODU1QTNDOEEwREU2OTg3RTE0M0ZBOTYyQTJDQUJGQTY5MkNDMzA3Mzk4MUM4QTZGMEIwMDU4QUM5QzI2RDcwNDQwNjlFRjIzNTk2MzY2OEMzM0VBNEUzMTgzQzQxQ0UwREY3OUNGM0U4OUNCRTQwQ0RGOEY1MkU5MkU1NTg4OTBBQjFBOTQyMDFDRDAwQjg3RDFEMjE3MDMwNDRFNzQwMDAxRTdCQ0EyN0IzQTM1RTRBQzEzQjk2Nzg3QkMwRDZFOTMyMTFBNkZDRjc0QkMxQzhDNDVBOUVDQzA2M0E5OUQzQzFBRDBFNTU5RDYxNkIzRjk4RjUyRjg2QzhCRjQ3MEI3QkM0QTcxOTk3QjE3QTI4OUZGMjVGNjFBMjQ3OUY3MkU3QTM5MTUzQ0QwRUIwQjFDQUU2MjJDNkFCMDE2RTVGNzIyODczQkFGRTZENjRFNkNDQzE5OTUyRTIxOTFGRjZBNjE4N0M4QzM1NEJGMkM3NUU5M0RCMzBDNzQ4RjgzRTY0MDA5In0=';
	  // Initiate the Checkout form.
	  var checkout = chckt.checkout(paymentSession, '#your-payment-div', sdkConfigObj);
	  console.log("checkout",checkout); 
	  
	}

	chckt.hooks.beforeComplete = function(node, paymentData) {
		console.log('Payment Succesfull', paymentData);
		if(paymentData.resultCode == "authorised"){
			$location.path( "/home" );
		}
		return true; // Indicates that you want to replace the default handling.
	 };

	 $scope.createPaymentSession = function(){
		var payementdata = { 
			"amount": { 
			   "currency": "GBP", 
			   "value": "12025"
			}, 
			"reference": "HNBOrder001",
			"merchantAccount": "HnBECommTest",
			"sdkVersion": "1.3.2",
			"shopperReference": "yourShopperId_IOfW3k9G2PvXFu2j",
			"channel": "Web",
			"html": true,
			"origin": "https://hnbfour.herokuapp.com/",
			"returnUrl": "https://hnbfour.herokuapp.com/!#/checkout", 
			"countryCode": "GB",
			"shopperLocale": "en_GB"
		 };
		 return paymentService.getPaymentSession(payementdata);
	 
	 }
	 
	 function getDeliveryOptions(){ 
		var cart = headerService.sessionGet('cart');
		checkoutService.getDeliveryOptions(cart.id).then(function(response) {
			console.log(response);
		});
	 }
}]);

