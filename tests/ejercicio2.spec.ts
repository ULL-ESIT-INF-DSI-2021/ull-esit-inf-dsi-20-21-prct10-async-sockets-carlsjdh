import 'mocha';
import {expect} from 'chai';
import {execSync} from 'child_process';

const test = (args :string) => {
  return execSync(`node dist/ejercicio2/appWithPipe.js get ${args}`).toString();
};

const test2 = (args :string) => {
  // eslint-disable-next-line max-len
  return execSync(`node dist/ejercicio2/appWithoutPipe.js get ${args}`).toString();
};


describe(('EJ2: wc'), () => {
  it(('Muestra número de líneas withPipe'), () => {
    expect(test(`--file="helloworld.txt" --option="l"`)).to.equal(
        `Great! We can execute!\nhelloworld.txt has 3 lines\n`,
    );
  });

  it(('Muestra número de caracteres  withPipe'), () => {
    expect(test(`--file="helloworld.txt" --option="c"`)).to.equal(
        `Great! We can execute!\nhelloworld.txt has 21 characters\n`,
    );
  });

  it(('Muestra número de palabras  withPipe'), () => {
    expect(test(`--file="helloworld.txt" --option="w"`)).to.equal(
        `Great! We can execute!\nhelloworld.txt has 6 words\n`,
    );
  });

  it(('Muestra número de líneas withoutPipe'), () => {
    expect(test2(`--file="helloworld.txt" --option="l"`)).to.equal(
        `Great! We can execute!\nhelloworld.txt has 3 lines\n`,
    );
  });

  it(('Muestra número de caracteres withoutPipe'), () => {
    expect(test2(`--file="helloworld.txt" --option="c"`)).to.equal(
        `Great! We can execute!\nhelloworld.txt has 21 characters\n`,
    );
  });

  it(('Muestra número de palabras withoutPipe'), () => {
    expect(test2(`--file="helloworld.txt" --option="w"`)).to.equal(
        `Great! We can execute!\nhelloworld.txt has 6 words\n`,
    );
  });
});
