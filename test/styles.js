import chai from 'chai';
const expect = chai.expect;

import StyleMap from '../source/styles';
import { merge } from '../source/styles';

describe('StyleMap', () => {
  it('should be a constructor function', () => {
    expect(StyleMap).to.be.a('function');
    let s = new StyleMap({});
    expect(s).to.exist;
  });

  it('should accept css-in-js defs and wraps around it', () => {
    let def = {
      header: {
        backgroundColor: 'red',
        position: 'fixed',
        top: 0
      }
    };
    let s = new StyleMap(def);
    expect(s.header).to.exist;
    expect(s.header.backgroundColor).to.equal(def.header.backgroundColor);
    expect(s.header.position).to.equal(def.header.position);
    expect(s.header.top).to.equal(def.header.top);

  });

  it('should accept nested defs and flatten the definitions', () => {
    let def = {
      header: {
        backgroundColor: 'red',
        position: {
          position: 'fixed',
            top: {
              top: 0
            }
        }
      }
    };
    let s = new StyleMap(def);
    expect(s.header.backgroundColor).to.equal('red');
    expect(s.header.position).to.equal('fixed');
    expect(s.header.top).to.equal(0);
  });

  it('should ignore non object definitions', () => {
    let def = {
      header: {
        backgroundColor: 'red'
      },
      body: 'red'
    };
    let s = new StyleMap(def);
    expect(s.body).to.not.exist;
  });

});

describe('merge', () => {
  it('should be a function', ()=> {
    expect(merge).to.be.a('function');
  });

  it('should return objects', () => {
    let s = merge();
    expect(s).to.exist;
    expect(s).to.be.a('object');
  });

  it('should merge multiple objects, with last property wins strategy', () => {
    let [a, b, c] = [{
      a: 1
    }, {
      b: 3
    }, {
      a: 2,
      c: 4
    }];
    let res = merge(a, b, c);
    expect(res.a).to.equal(2);
    expect(res.b).to.equal(3);
    expect(res.c).to.equal(4);
  });
});
