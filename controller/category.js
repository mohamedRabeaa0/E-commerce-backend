const Category = require('../models/Category')
const {_cate} = require('../helper/msg')

///////custom function to get all category in nested array/////////
function getCategories(categories, parentId = null) {
  const categoryList = [];
  let category;

  //get main category
  if (parentId == null) {
    
    category = categories.filter((cat) => cat.parentId == undefined);
  
  } else {

    //get sub category
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  //loop for gat all category an childern
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      desc: cate.desc,
      parentId: cate.parentId,
      img: cate.img,
      children: getCategories(categories, cate._id)
    });
  }

  return categoryList;
}

///////////get a category by id////////////
exports.getCate = async (req, res) => {
    try{

        //find category in DB
        const category = await Category.findById(req.params.id)
        
        if (!category) return res.status(400).json({message: _cate.notFound})
        
        return res.status(200).json({data: category})
    
    }catch(error){
        
        return res.status(400).json({error})
    }
}

////////////get all category//////////////
exports.getAll = async (req, res) => {
    try{

        //find all category in DB
        const categories = await Category.find()
        
        if(!categories) return res.status(400).json({message: _cate.notFound})          
        
        //call getCategories function to sort data in nested array
        const categoriesList = getCategories(categories)

        return res.status(200).json({data: categoriesList}) 
    
    }catch(error){
        
        return res.status(400).json({error})
    }
}