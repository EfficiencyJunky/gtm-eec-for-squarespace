// this function takes the rawProductDetail and converts it into a properly formatted object with a single "detail" key that Google Tag Manager can use to generate an Enhanced Ecommerce event for the Product Detail View
function(){
  
    var ssRawProductDetail = {{DL - SS Raw Product Detail}};  

    // first check to make sure something didn't go wrong in the formation of this object
    if(ssRawProductDetail == undefined){
        return undefined; 
    }
  
    // convert the raw "ssRawProductDetail" object to a productJSON
    var productJSON = convertSSRawProductDetailtoProductJSON(ssRawProductDetail);

    // create our base level eecCheckout object with the products list
    var eecDetailObj = {{JS Utility - create eecObjectFromAction}}('detail', productJSON);

    // add the actionField with list key/value based on the referrer
    // this function will only add the list if the referrer was actualy one with a list
    {{JS Utility - add list from referrer}}(eecDetailObj, 'detail', {{Referrer}});        
    
    
    // return our properly formatted enhanced ecommerce detail event object
    return eecDetailObj;


    // *********************************************************************************
    // This function does the work of converting the newlyAdded object to a productJSON
    // *********************************************************************************
    function convertSSRawProductDetailtoProductJSON(ssRawProductDetail){

        // pull out the category
        // this should eventually be replaced by a cookie saving info from product impressions
        var category = ssRawProductDetail.product.variants[0].attributes.category;

        var variant = ssRawProductDetail.product.variants[0];

        // initialize the productJSON
        var productJSON = {
            'productId': ssRawProductDetail.item.id,
            'productName': ssRawProductDetail.item.title,
            'productCategory': category,
            // may want to add 'productPrice' but this is TBD
            'variants': [{
                'sku': variant.sku,
                'price': (variant.onSale) ? variant.salePrice.decimalValue : variant.price.decimalValue,
                'unlimited': variant.stock.unlimited,
                'qtyInStock': variant.stock.quantity, // can be 0 if unlimited is true
                'onSale': variant.onSale
            }]
        };

        return productJSON;
    }

}