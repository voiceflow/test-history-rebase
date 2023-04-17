import type Chai from 'chai';

function isOnRoute(_chai: Chai.ChaiStatic) {
  _chai.Assertion.addMethod('onRoute', function (page, ...args) {
    new _chai.Assertion(page).to.have.nested.property('meta.route');

    if (typeof page.meta.route === 'function') {
      this.assert(
        page.meta.route(this._obj, ...args),
        'expected #{this} to match the page route',
        'expected #{this} to not match the page route',
        this._obj
      );
    } else if (page.meta.route instanceof RegExp) {
      this.assert(
        page.meta.route.test(this._obj),
        `expected #{this} to match the regex ${page.meta.route.toString()}`,
        `expected #{this} to not match the regex ${page.meta.route.toString()}`,
        this._obj
      );
    } else if (page.meta.route != null) {
      this.assert(
        this._obj === page.meta.route,
        `expected #{this} to match the route ${page.meta.route}`,
        `expected #{this} to not match the route ${page.meta.route}`,
        this._obj
      );
    } else {
      _chai.assert.fail('page model must define a "meta.route" property to be used with this assertion');
    }
  });
}

const between = (x: number, min: number, max: number) => x >= min && x <= max;

function hasCoords(_chai: Chai.ChaiStatic) {
  _chai.Assertion.addMethod('coords', function ([coordsX, coordsY], pixelDisparity = 4) {
    const { left, top } = this._obj.offset();
    const x = Math.floor(left);
    const y = Math.floor(top);

    this.assert(
      between(x, coordsX - pixelDisparity, coordsX + pixelDisparity) && between(y, coordsY - pixelDisparity, coordsY + pixelDisparity),
      `expected [${x}, ${y}] to match coordinates [${coordsX}, ${coordsY}] within ${pixelDisparity} pixel disparity`,
      `expected [${x}, ${y}] to not match coordinates [${coordsX}, ${coordsY}] within ${pixelDisparity} pixel disparity`,
      [x, y]
    );
  });
}

function hasCanvasFocus(_chai: Chai.ChaiStatic) {
  _chai.Assertion.addMethod('canvasFocus', function () {
    if (_chai.util.flag(this, 'negate')) {
      new _chai.Assertion(this._obj).to.not.have.class('vf-canvas__node--focused');
    } else {
      new _chai.Assertion(this._obj).to.have.class('vf-canvas__node--focused');
    }
  });
}

chai.use(isOnRoute);
chai.use(hasCoords);
chai.use(hasCanvasFocus);
