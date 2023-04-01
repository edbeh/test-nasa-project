const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_LIMIT_NUMBER = 0;

const getPagination = (query) => {
  const absPage = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const absLimit = Math.abs(query.limit) || DEFAULT_LIMIT_NUMBER;
  const skip = (absPage - 1) * absLimit;

  return { limit: absLimit, skip };
};

module.exports = getPagination;
