import Product from "../models/productModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;         
  const limit = parseInt(req.query.limit) || 10;      
  const search = req.query.search || "";          
  const category = req.query.category || "";

  const skip = (page - 1) * limit;

  const query = {};

  if (search.trim()) {
    query.name = { $regex: search.trim(), $options: "i" }; 
  }

  if (category.trim()) {
    query.category = category.trim(); 
  }

  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate("createdBy", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 

  res.status(200).json(
    new ApiResponse(200, {
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    }, "Products fetched successfully")
  );
});


const getProductByid = asyncHandler(async(req,res)=>{
    const product_id = req.params.id;
    const product = await Product.findById(product_id);
    if(!product){
        throw new  ApiError(404,"Product not found")
    }
    res.status(202).json(
        new  ApiResponse(200,product,"Product found")
    )
})

export 
{getProductByid,
    getProducts
}


