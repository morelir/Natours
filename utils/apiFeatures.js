class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A)Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    //1B)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 2)Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      //sorting two parameters, e.g. sort('price ratingsAverage') - sorting prices first and then equal prices sorting by ratingsAverage
    } else {
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }

  //3)Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //means __v field excluded
    }
    return this;
  }

  //4) Pagination
  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    //e.g. page=2&limit=10 , 1-10 page 1, 11-20 page 2 ...
    const skip = limit * (page - 1);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
