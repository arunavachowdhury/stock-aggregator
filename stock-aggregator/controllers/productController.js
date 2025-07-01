const Product = require('../db/models/product');
const Vendor = require('../db/models/vendor');
const catchAsync = require('../utils/catchAsync');

const getProducts = catchAsync(async(req, res, next) => {
  const vendorResponse = await fetch('http://localhost:3001/api/VendorA/items');
  const data = await vendorResponse.json();
  const productRecord = data.data;
    
  const [vendorData] = await Vendor.findOrCreate({
    where: {
        name: 'Vendor-A'
    }  
  });

  const mappedProducts = productRecord.map(item => ({
    vendorId: vendorData.id,
    vendorProductId: item._id,
    productName: item.productName,
    actualStock: item.actualStock,
    reservedStock: item.reservedStock ?? 0,
    price: item.price
  }));

  await Product.bulkCreate(mappedProducts);

  return res.status(200).json({ msg: 'Product data insert successfully' });

}) 

module.exports = {
    getProducts
}

