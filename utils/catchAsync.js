//this function allows us to get rid of the try catch block in async function
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //same as writing 'err => next(err)' instead 'next'
  };
};
