export interface IValidatorSuccessResult<T> {
  data: T;
  success: true;
}

export interface IValidatorErrorResult {
  error: Error;
  success: false;
}

export type IValidatorResult<T> = IValidatorSuccessResult<T> | IValidatorErrorResult;

export interface IValidator<T> {
  _input?: T;

  _context?: void;

  (value: T): IValidatorResult<T>;
}

export interface IValidatorWithContext<T, C> {
  _input?: T;

  _context?: Exclude<C, void>;

  (value: T, context: C): IValidatorResult<T>;
}

export interface IValidatorFactory {
  <T>(refinement: (value: T) => unknown, message: string | ((arg: T) => string)): IValidator<T>;
  <T, C>(
    refinement: (value: T, context: C) => unknown,
    message: string | ((value: T, context: C) => string)
  ): IValidatorWithContext<T, C>;
}

export interface IComposeValidators {
  <T>(...validators: Array<IValidator<T>>): IValidator<T>;

  <T, C1>(validator1: IValidatorWithContext<T, C1>): IValidatorWithContext<T, C1>;

  <T, C1, C2>(
    validator1: IValidatorWithContext<T, C1>,
    validator2: IValidatorWithContext<T, C2>
  ): IValidatorWithContext<T, C1 & C2>;

  <T, C1, C2, C3>(
    validator1: IValidatorWithContext<T, C1>,
    validator2: IValidatorWithContext<T, C2>,
    validator3: IValidatorWithContext<T, C3>
  ): IValidatorWithContext<T, C1 & C2 & C3>;

  <T, C1, C2, C3, C4>(
    validator1: IValidatorWithContext<T, C1>,
    validator2: IValidatorWithContext<T, C2>,
    validator3: IValidatorWithContext<T, C3>,
    validator4: IValidatorWithContext<T, C4>
  ): IValidatorWithContext<T, C1 & C2 & C3 & C4>;

  <T, C1, C2, C3, C4, C5>(
    validator1: IValidatorWithContext<T, C1>,
    validator2: IValidatorWithContext<T, C2>,
    validator3: IValidatorWithContext<T, C3>,
    validator4: IValidatorWithContext<T, C4>,
    validator5: IValidatorWithContext<T, C5>
  ): IValidatorWithContext<T, C1 & C2 & C3 & C4 & C5>;

  <T, C1, C2, C3, C4, C5, C6>(
    validator1: IValidatorWithContext<T, C1>,
    validator2: IValidatorWithContext<T, C2>,
    validator3: IValidatorWithContext<T, C3>,
    validator4: IValidatorWithContext<T, C4>,
    validator5: IValidatorWithContext<T, C5>,
    validator6: IValidatorWithContext<T, C6>
  ): IValidatorWithContext<T, C1 & C2 & C3 & C4 & C5 & C6>;

  <T, C>(...validators: Array<(value: T, context: C) => IValidatorResult<T>>): IValidatorWithContext<T, C>;
}
