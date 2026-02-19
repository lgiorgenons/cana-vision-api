// common/errors/propriedade-errors.ts
import { ApplicationError } from './application-error'

export class PropriedadeAlreadyExistsError extends ApplicationError {
  constructor() {
    super('Já existe uma propriedade com esse código interno', 409, 'CODIGO_INTERNO_ALREADY_EXISTS')
  }
}

export class ClienteNotFoundError extends ApplicationError {
  constructor() {
    super('Cliente não encontrado', 404, 'CLIENTE_NOT_FOUND')
  }
}
