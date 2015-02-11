import chai from 'chai';

const expect = chai.expect;

import Tmpl from '../source/tmpl';


describe('tmpl', () => {
  it('should be a constructor function', () => {
    expect(Tmpl).to.be.a('function');
  });

  it('should return a tmpl object', () => {
    let a = new Tmpl('test');
    expect(a).to.exist();
  });

  describe('tmpl object', () => {
    let a = new Tmpl('${name}:${gender}');
    it('should have a format function', () => {
      expect(a.format).to.be.a('function');
    });
    describe('format function', () => {
      it('should return formatted result when given params', () => {
        let res = a.format({
          name: 'Jack',
          gender: 'male'
        });
        expect(res).to.equal('Jack:male');
      });

      it('should leave template variables as is if params has no matching definition', () => {
        let res = a.format({
          name: 'Jack'
        });
        expect(res).to.equal('Jack:${gender}');
      });
    });
  });

  it('should have a static format function', () => {
    expect(Tmpl.format).to.be.a('function');
  });



  describe('static format', () => {
    it('should return empty string if the first parameter is not a string', ()=> {
      expect(Tmpl.format()).to.equal('');
      expect(Tmpl.format({})).to.equal('');
      expect(Tmpl.format(3)).to.equal('');
      expect(Tmpl.format([])).to.equal('');
      expect(Tmpl.format(true)).to.equal('');
    });

    it('should return formatted string', () => {
      let a = Tmpl.format('${name}:${gender}', {
        name: 'Jack',
        gender: 'male'
      });
      expect(a).to.equal('Jack:male');
    });

    it('should leave template variables alone if not defined in params', () => {
      let a = Tmpl.format('${name}:${gender}', {
        name: 'Jack'
      });
      expect(a).to.equal('Jack:${gender}');
    });
  });

});
