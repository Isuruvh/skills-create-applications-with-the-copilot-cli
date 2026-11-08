#!/usr/bin/env node

function modulo(a, b) {
  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Cannot calculate the square root of a negative number.');
  }

  return Math.sqrt(n);
}

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (^), and square root (sqrt).
function calculate(leftOperand, operator, rightOperand) {
  switch (operator) {
    case '+':
      return leftOperand + rightOperand;
    case '-':
      return leftOperand - rightOperand;
    case '*':
      return leftOperand * rightOperand;
    case '/':
      if (rightOperand === 0) {
        throw new Error('Cannot divide by zero.');
      }
      return leftOperand / rightOperand;
    case '%':
    case '^': {
      if (!Number.isFinite(leftOperand) || !Number.isFinite(rightOperand)) {
        throw new Error('Operands must be finite numbers.');
      }
      if (operator === '%' && rightOperand === 0) {
        throw new Error('Cannot calculate modulo by zero.');
      }
      const result = operator === '%' ? modulo(leftOperand, rightOperand) : power(leftOperand, rightOperand);
      if (!Number.isFinite(result)) {
        throw new Error('The result must be a finite real number.');
      }
      return result;
    }
    case 'sqrt':
      if (!Number.isFinite(leftOperand)) {
        throw new Error('The operand must be a finite number.');
      }
      if (leftOperand < 0) {
        throw new Error('Cannot take the square root of a negative number.');
      }
      return Math.sqrt(leftOperand);
    default:
      throw new Error(`Unsupported operation: ${operator}`);
  }
}

function parseOperand(value, position) {
  const operand = Number(value);

  if (!Number.isFinite(operand)) {
    throw new Error(`The ${position} operand must be a finite number.`);
  }

  return operand;
}

function run(arguments_) {
  if (arguments_.length === 2 && arguments_[0] === 'sqrt') {
    return calculate(parseOperand(arguments_[1], 'first'), 'sqrt');
  }

  if (arguments_.length !== 3) {
    throw new Error('Usage: node src/calculator.js <number> <+|-|*|/|%|^> <number> or node src/calculator.js sqrt <number>');
  }

  const [leftValue, operator, rightValue] = arguments_;
  if (operator === 'sqrt') {
    throw new Error('Square root requires one operand: node src/calculator.js sqrt <number>');
  }
  const leftOperand = parseOperand(leftValue, 'first');
  const rightOperand = parseOperand(rightValue, 'second');

  return calculate(leftOperand, operator, rightOperand);
}

if (require.main === module) {
  try {
    console.log(run(process.argv.slice(2)));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, run, squareRoot };
