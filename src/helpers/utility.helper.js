import CustomError from './customError.js';

const executeService = async ({ service, entity, id }) => {
  const result = await service;

  if (entity && !result) {
    throw new CustomError(
      `${entity} com ID '${id}' não encontrado.`,
      404,
      '404-entity-not-found',
    );
  }

  return result;
};

const checkValidValue = (currentValue, newValue) => {
  if (typeof newValue === 'undefined' || newValue === currentValue) {
    return currentValue;
  }

  return newValue;
};

const shouldUpdateValue = (currentValue, newValue) => {
  const updatedValue = checkValidValue(currentValue, newValue);
  return updatedValue !== currentValue;
};

export { checkValidValue, executeService, shouldUpdateValue };
