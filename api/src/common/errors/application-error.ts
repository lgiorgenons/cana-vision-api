export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Não autorizado.') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = 'Operação não permitida.') {
    super(message, 403);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message = 'Registro em conflito.') {
    super(message, 409);
  }
}
