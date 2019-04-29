const PipelineError = require('../../entities/PipelineError');

describe('entities/PipelineError', () => {
  describe('#constructor()', () => {
    it('should set the error message', () => {
      const error = new PipelineError('Classified by section 31');
      expect(error.message).toEqual('Classified by section 31');
    });
    it('should set the response to null by default', () => {
      const error = new PipelineError('Classified by section 31');
      expect(error.response).toBeNull();
    });
    it('should set the response if the argument is not null', () => {
      const response = { section31: 'classified' };
      const error = new PipelineError('Classified by section 31', response);
      expect(error.response).toBe(response);
    });
  });
  describe('#setContainer()', () => {
    it('should set the container', () => {
      const error = new PipelineError('Classified by section 31');
      error.setContainer({ statusCode: 200, body: { section31: 'classified' } });
      expect(error.container).toBeTruthy();
      expect(error.container.body.section31).toEqual('classified');
    });
    it('should set the container with the 500 status code', () => {
      const error = new PipelineError('Classified by section 31');
      error.setContainer({ statusCode: 200, body: { section31: 'classified' } });
      expect(error.container.statusCode).toBe(500);
    });
    it('should set the container with the response status code if applicable', () => {
      const error = new PipelineError('Classified by section 31', { statusCode: 404 });
      error.setContainer({ statusCode: 200, body: { section31: 'classified' } });
      expect(error.container.statusCode).toBe(404);
    });
  });
});
