app.factory('Cart', function(){
  function Cart(data){
    this.lineItems = [];
    if(data){
      this._id = data._id;
      this.lineItems = data.lineItems;
    }
  }

  Cart.prototype.getItemCount = function(){
    return this.lineItems.reduce(function(memo, lineItem){
      memo += lineItem.quantity;
      return memo;
    }, 0);
  };
  return Cart;

});
