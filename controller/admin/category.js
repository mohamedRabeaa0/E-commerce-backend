const Category = require('../../models/Category')
const {_cate} = require('../../helper/msg')

//custom function to get all category in nested array
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

////////////////create product////////////
exports.create = async (req, res) => {
    try{

        //check if already exist category with same name
        const existCate = await Category.findOne({name: req.body.name})
        
        if (existCate) return res.status(400).json({message: _cate.exist})
        
        //create new category
        const category = await new Category(req.body).save();
        
        return res.status(200).json({message: _cate.create, data: category})
        
    }catch(error){
        
        return res.status(400).json({error})
    }
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

////////////update a category/////////////
exports.update = async (req, res) => {
    try{

        const inputData = req.body;

        //find category in DB and update
        const category = await Category.findOneAndUpdate({_id: req.params.id}, 
            {$set:inputData}, 
            {new: true})

        if (!category) return res.status(400).json({message: _cate.notFound})
        
        return res.status(200).json({message: _cate.update, data: category})
        
    }catch(error){

        return res.status(400).json({error})
    }
}

//////////remove category///////////////
exports.remove = async (req, res) => {
    try{

        //check if category has child category before delete
        const childCategory = await Category.findOne({parentId: req.params.id})

        if (childCategory) return res.status(400).json({message: _cate.child})
        
        //delete category
        await Category.deleteOne({_id: req.params.id})
        
        return res.status(200).json({message: _cate.removed})
    
    }catch(error){
        
        return res.status(400).json({error})
    }
}
