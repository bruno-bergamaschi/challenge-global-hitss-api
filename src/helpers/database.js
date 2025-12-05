import pkg from 'lodash';
const { camelCase } = pkg;

const softDelete = async ({
  dbClient,
  tableName,
  id,
  primaryColumn = 'id',
}) => {
  const values = [id];
  const query = `
    UPDATE
      ${tableName}
    SET
      is_deleted = true,
      deleted_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE
      ${primaryColumn} = $1
  `;

  await dbClient.query(query, values);
};

const toCamelCase = (obj) => {
  if (!obj) {
    return;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [camelCase(key), value]),
  );
};

const handleGetAll = (rows) => {
  const [first] = rows;
  let totalCount = 0;

  if (first) {
    totalCount = Number(first.total_count);
  }

  const entities = rows.map((item) => {
    delete item.total_count;

    return toCamelCase(item);
  });

  return {
    rows: entities,
    totalCount,
  };
};

const buildOrderBy = (orderString, defaultOrder, allowedColumns = []) => {
  if (!orderString) {
    return `ORDER BY ${defaultOrder}`;
  }

  const parts = orderString
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const orderFragments = parts
    .map((p) => {
      const match = p.match(/^([a-zA-Z0-9_\."]+)\s*[:\s]?\s*(asc|desc)?$/i);
      if (!match) return null;

      let column = match[1];
      let direction = (match[2] || 'asc').toUpperCase();

      if (direction !== 'ASC' && direction !== 'DESC') direction = 'ASC';

      if (!allowedColumns.includes(column)) return null;

      if (!column.startsWith('"') && !column.endsWith('"')) {
        column = `"${column}"`;
      }

      return `${column} ${direction}`;
    })
    .filter(Boolean);

  if (orderFragments.length === 0) {
    return `ORDER BY ${defaultOrder}`;
  }

  return `ORDER BY ${orderFragments.join(', ')}`;
};

export const databaseHelper = {
  buildOrderBy,
  softDelete,
  toCamelCase,
  handleGetAll,
};
