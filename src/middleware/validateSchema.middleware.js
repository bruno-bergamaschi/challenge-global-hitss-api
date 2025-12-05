import CustomError from '../helpers/customError.js';

const _handleProperties = (properties) => {
  return properties.issues
    .map((issue) => {
      const [property] = issue.path;
      return `'${property}' ${issue.message}`;
    })
    .toString();
};

export const validateSchema = (schema) => (req, _, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    throw new CustomError(
      'Erro no corpo da requisição',
      400,
      '400-request-body',
      _handleProperties(err),
    );
  }
};
