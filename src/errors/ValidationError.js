class ValidationError extends Error {
  errors;
  code;
  
  constructor(errors = [], message = 'Unprocessable Entity', code = 920) {
    super(message);

    this.errors = errors;
    this.message = message;
    this.code = code;
  }
}

module.exports = ValidationError;