import chai from 'chai';
import debug from 'debug';

//debug.enable('test-instance');

const log = debug('test-instance');
const expect = chai.expect;

import Instance from '../source/instance';
import { DEMOTE, PROMOTE } from '../source/instance';



describe('Instance', () => {
  let a, b, key;
  afterEach(() => {
    log('after each Instance test');
    if(a && a.destroy) {
      a.destroy();
    }
    if(b && b.destroy) {
      b.destroy();
    }
    a = null;
    b = null;
    key = null;
  });
  it('should be a constructor function', () => {
    expect(Instance).to.be.a('function');
  });

  it('should have static getInstance function',() => {
    expect(Instance.getInstance).to.be.a('function');
  });

  it('should be extendable', () => {
    class Test extends Instance {
      test() {
        return 'tt';
      }
    }
    expect(Test).to.be.a('function');
    expect(Test.getInstance).to.be.a('function');
    key = {};
    a = Test.getInstance(key);
    expect(a.test).to.be.a('function');
    expect(a.test()).to.equal('tt');
    b = Test.getInstance(key);
    expect(a).to.equal(b);
    b = Test.getInstance();
    expect(a).to.not.equal(b);
    b.destroy();
    a[PROMOTE]();
    b = Test.getInstance();
    expect(a).to.equal(b);
    a[DEMOTE]();
    b = Test.getInstance();
    expect(a).to.not.equal(b);
    a.destroy();
    b.destroy();
    a = Test.getInstance();
    expect(a).to.not.equal(b);
  });

  describe('getInstance', () => {
    it('should return a global instance', () => {
      a = Instance.getInstance();
      b = Instance.getInstance();
      expect(a).to.equal(b);
    });

    it('should accept an object as key and always return the same instance', () => {
      key = {};
      a = Instance.getInstance(key);
      b = Instance.getInstance(key);
      expect(a).to.equal(b);
    });

    it('should return different instance for global and keyed instance', () => {
      key = {};
      a = Instance.getInstance();
      b = Instance.getInstance(key);
      expect(a).to.not.equal(b);
    });
  });

  describe('instance object', () => {
    it('should have function destroy', () => {
      a = Instance.getInstance();
      expect(a.destroy).to.be.a('function');
    });

    describe('function destroy', () => {
      it('should remove the instance from cache', () =>  {
        a = Instance.getInstance();
        a.destroy();
        b = Instance.getInstance();
        expect(a).to.not.equal(b);
        b.destroy();

        key = {};
        a = Instance.getInstance(key);
        a.destroy();
        b = Instance.getInstance(key);
        expect(a).to.not.equal(b);

      });
    });

  });

  describe('PROMOTE', () => {
    it('should be an accessor to a function on keyed instances', () => {
      key = {};
      a = Instance.getInstance(key);
      expect(a[PROMOTE]).to.be.a('function');
    });

    it('should only work with keyed instances', () => {
      a = Instance.getInstance();
      expect(a[PROMOTE]).to.not.exist();
    });

    it('should promote an keyed instance to global instance', () => {
      key = {};
      a = Instance.getInstance(key);
      a[PROMOTE]();
      b = Instance.getInstance();
      expect(a).to.equal(b);
      a[DEMOTE]();
    });

  });

  describe('DEMOTE', () => {
    it('should be an accessor to a function on keyed instances', () => {
      key = {};
      a = Instance.getInstance(key);
      expect(a[DEMOTE]).to.be.a('function');
    });

    it('should only work with keyed instances', () => {
      a = Instance.getInstance();
      expect(a[DEMOTE]).to.not.exist();
    });

    it('should demote a promoted instance from being global', () => {
      key = {};
      a = Instance.getInstance(key);
      a[PROMOTE]();
      a[DEMOTE]();
      b = Instance.getInstance();
      expect(a).to.not.equal(b);
    });

    it('should not have affect if instance has not been promoted', () => {
      key = {};
      a = Instance.getInstance(key);
      a[DEMOTE]();
    });
  });

  //TODO: derefencing keys should destroy keyed instances... need to actively trigger gc and also check heap information
});
