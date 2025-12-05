class CustomError extends Error {
  constructor(message, httpStatusCode, businessStatusCode, details = null) {
    super(message);
    this.name = 'CustomError';
    this.httpStatusCode = httpStatusCode;
    this.businessStatusCode = businessStatusCode;
    this.details = details;
  }
}
export default CustomError;
