export class LimitlessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, LimitlessError.prototype);
  }
}

export class LimitlessAPIError extends LimitlessError {
  readonly code: number;
  readonly type: string;
  readonly raw: any;

  constructor(message: string, code: number, raw?: any) {
    super(message);
    this.code = code;
    this.type = 'api_error';
    this.raw = raw;
    Object.setPrototypeOf(this, LimitlessAPIError.prototype);
  }
}

export class LimitlessAuthenticationError extends LimitlessError {
  readonly code: number;
  readonly type: string;

  constructor(message: string) {
    super(message);
    this.code = 401;
    this.type = 'authentication_error';
    Object.setPrototypeOf(this, LimitlessAuthenticationError.prototype);
  }
}

export class LimitlessNetworkError extends LimitlessError {
  readonly type: string;
  readonly raw: any;

  constructor(message: string, raw?: any) {
    super(message);
    this.type = 'network_error';
    this.raw = raw;
    Object.setPrototypeOf(this, LimitlessNetworkError.prototype);
  }
}

export class LimitlessValidationError extends LimitlessError {
  readonly type: string;
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.type = 'validation_error';
    this.field = field;
    Object.setPrototypeOf(this, LimitlessValidationError.prototype);
  }
} 