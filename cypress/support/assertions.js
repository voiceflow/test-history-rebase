function isOnRoute(_chai) {
  function assertIsOnRoute(page, ...args) {
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
  }

  _chai.Assertion.addMethod('onRoute', assertIsOnRoute);
}

function hasCoords(_chai) {
  function assertHasCoords([coordsX, coordsY]) {
    const { left, top } = this._obj.offset();
    const x = Math.floor(left);
    const y = Math.floor(top);

    this.assert(
      x === coordsX && y === coordsY,
      `expected [${x}, ${y}] to match coordinates [${coordsX}, ${coordsY}]`,
      `expected [${x}, ${y}] to not match coordinates [${coordsX}, ${coordsY}]`,
      [x, y]
    );
  }

  _chai.Assertion.addMethod('coords', assertHasCoords);
}

chai.use(isOnRoute);
chai.use(hasCoords);
