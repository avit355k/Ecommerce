const getAllChildCategories = (categories, parentId) => {
    let result = [];

    const findChildren = (parent) => {
        const children = categories.filter(
            cat => String(cat.parent) === String(parent)
        );

        children.forEach(child => {
            result.push(child._id);
            findChildren(child._id);
        });
    };

    findChildren(parentId);
    return result;
};

module.exports = {getAllChildCategories};
