import CustomError from '../helpers/customError.js';
import pkg from 'lodash';
const { snakeCase, trim } = pkg;

export const createQueryOptions = (req, _, next) => {
  let page = req?.query?.page || 1;
  let perPage = req?.query?.perPage || 10;

  if (!(page > 0 && perPage > 0)) {
    throw new CustomError(
      'Parâmetros de paginação inválidos.',
      400,
      '400-ivalid-pagination',
    );
  }

  const limit = perPage;
  const offset = perPage * (page - 1);

  const filter = req.query.search || null;

  let order = null;

  if (req.query.orderBy && req.query.sortBy) {
    const orderBySplited = req.query.orderBy
      .split('|')
      .map((item) => trim(item));
    const sortBySplited = req.query.sortBy.split('|').map((item) => trim(item));

    if (orderBySplited.length !== sortBySplited.length) {
      throw new CustomError(
        'Parâmetros de ordenação inválidos.',
        400,
        '400-ivalid-pagination',
      );
    }

    const invalidSortBy = sortBySplited.some(
      (sort) => sort.toUpperCase() !== 'ASC' && sort.toUpperCase() !== 'DESC',
    );

    if (invalidSortBy) {
      throw new CustomError('SortBy inválido.', 400, '400-ivalid-pagination');
    }

    order = orderBySplited
      .map((order, index) => {
        return `${snakeCase(order)} ${sortBySplited[index]}`;
      })
      .join(', ');
  }

  req.queryOptions = {
    limit,
    offset,
    filter,
    order,
  };

  return next();
};
