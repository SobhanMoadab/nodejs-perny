module.exports = (array, page_size, page_number) => {
   
    return {
        docs: array.slice((page_number - 1) * page_size, page_number * page_size),
        total: array.length,
        limit: page_size,
        page: page_number,
        pages: Math.ceil(array.length/page_size)
    }
    
}