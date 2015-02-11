import chai from 'chai';

import uuid from '../source/uuid';

const expect = chai.expect;

describe('uuid', () => {
  it('should be a function', () => {
    expect(uuid).to.be.a('function');
  });

  it('should return a valid uuid', () => {
    let res = uuid();
    expect(res).to.be.a('string');
    expect(/^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(res)).to.equal(true);
  });
});
