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
    expect(() => calculate(2, '%', 3)).toThrow('Unsupported operation: %');
  });
});

describe('run', () => {
  test('parses CLI arguments and returns a result', () => {
    expect(run(['2', '+', '3'])).toBe(5);
  });

  test('rejects missing CLI arguments', () => {
    expect(() => run(['2', '+'])).toThrow(
      'Usage: node src/calculator.js <number> <+|-|*|/> <number>',
    );
  });

  test.each([
    [['two', '+', '3'], 'The first operand must be a finite number.'],
    [['2', '+', 'Infinity'], 'The second operand must be a finite number.'],
  ])('rejects invalid numeric arguments', (arguments_, message) => {
    expect(() => run(arguments_)).toThrow(message);
  });
});
