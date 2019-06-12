import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Page404 extends Component {
  render() {
    return (
      <div className="h-100 w-100 super-center">
        <div className="text-center">
          <h1 className="text-muted">404</h1>
          <h1>Whoops, we couldn't find that</h1>
          <Link to="/" className="btn btn-primary mt-3">
            <i className="far fa-long-arrow-left mr-2" />
            Home
          </Link>
        </div>
      </div>
    );
  }
}

export default Page404;
