app.factory('Cart', function(){
  function Cart(data){
    if(data){
      this._id = data._id;
    }
  }

  Cart.prototype.getItemCount = function(){
    return this._id;
  };
  return Cart;

});
