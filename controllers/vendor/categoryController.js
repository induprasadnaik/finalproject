import Category from '../../models/categoryModel.js';

export const getAllCategories = async (req, res) => {
  try {
    const vendorid = req.loggedUser._id; //logged in user id

    const categories = await Category.find({ isActive: true, vendor_id: vendorid })
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch categories",
      error: error.message
    });
  }
};
export const createCategory = async (req, res) => {
  try {
    const vendorid = req.loggedUser._id; //logged in user id
    const { name, slug, parentId } = req.body;

    const category = await Category.create({
      name,
      slug,
      parentId: parentId || null,
      vendor_id: vendorid || null
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create category",
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const vendorid = req.loggedUser._id; //logged in user id

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update category",
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Category disabled successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete category",
      error: error.message
    });
  }
};