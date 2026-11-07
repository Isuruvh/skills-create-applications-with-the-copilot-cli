const { calculate, run } = require('../calculator');

describe('calculate', () => {
  test.each([
    [2, '+', 3, 5],
    [10, '-', 4, 6],
    [45, '*', 2, 90],
    [20, '/', 5, 4],
  ])('calculates %d %s %d as %d', (leftOperand, operator, rightOperand, expected) => {
    expect(calculate(leftOperand, operator, rightOperand)).toBe(expected);
  });

  test('supports decimal and negative operands', () => {
    expect(calculate(-2.5, '+', 1.25)).toBe(-1.25);
    expect(calculate(-3, '*', 4)).toBe(-12);
  });

  test('rejects division by zero', () => {
    expect(() => calculate(20, '/', 0)).toThrow('Cannot divide by zero.');
  });

  test('rejects unsupported operations', () => {
    expect(() => calculate(2, '?', 3)).toThrow('Unsupported operation: ?');
  });

  test.each([
    [10, '%', 3, 1],
    [-10, '%', 3, -1],
    [2, '^', 3, 8],
    [4, '^', -0.5, 0.5],
  ])('calculates %d %s %d as %d', (leftOperand, operator, rightOperand, expected) => {
    expect(calculate(leftOperand, operator, rightOperand)).toBe(expected);
  });

  test.each([0, -0])('rejects modulo by zero', (zero) => {
    expect(() => calculate(10, '%', zero)).toThrow('Cannot calculate modulo by zero.');
  });

  test.each([[0, -1], [-1, 0.5], [10, 1000]])(
    'rejects non-finite or non-real powers',
    (base, exponent) => {
      expect(() => calculate(base, '^', exponent)).toThrow('The result must be a finite real number.');
    },
  );

  test.each(['%', '^'])('rejects non-finite operands for %s', (operator) => {
    expect(() => calculate(Infinity, operator, 2)).toThrow('Operands must be finite numbers.');
    expect(() => calculate(2, operator, NaN)).toThrow('Operands must be finite numbers.');
  });

  test('calculates square roots and rejects invalid operands', () => {
    expect(calculate(9, 'sqrt')).toBe(3);
    expect(calculate(0, 'sqrt')).toBe(0);
    expect(() => calculate(-1, 'sqrt')).toThrow('Cannot take the square root of a negative number.');
    expect(() => calculate(Infinity, 'sqrt')).toThrow('The operand must be a finite number.');
  });
});

describe('run', () => {
  test('parses CLI arguments and returns a result', () => {
    expect(run(['2', '+', '3'])).toBe(5);
  });

  test('rejects missing CLI arguments', () => {
    expect(() => run(['2', '+'])).toThrow(
      'Usage: node src/calculator.js <number> <+|-|*|/|%|^> <number> or node src/calculator.js sqrt <number>',
    );
  });

  test('runs new operations with the expected number of arguments', () => {
    expect(run(['10', '%', '3'])).toBe(1);
    expect(run(['2', '^', '3'])).toBe(8);
    expect(run(['sqrt', '9'])).toBe(3);
    expect(() => run(['9', 'sqrt', '4'])).toThrow('Square root requires one operand');
    expect(() => run(['sqrt', '9', '4'])).toThrow('The first operand must be a finite number.');
    expect(() => run(['sqrt', 'nope'])).toThrow('The first operand must be a finite number.');
    expect(() => run(['sqrt', '-1'])).toThrow('Cannot take the square root of a negative number.');
  });

  test.each([
    [['two', '+', '3'], 'The first operand must be a finite number.'],
    [['2', '+', 'Infinity'], 'The second operand must be a finite number.'],
  ])('rejects invalid numeric arguments', (arguments_, message) => {
    expect(() => run(arguments_)).toThrow(message);
  });
});
