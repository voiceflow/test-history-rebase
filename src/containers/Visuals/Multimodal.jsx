import "./Display.css";

import Button from "components/Button";
import EmptyCard from "components/Cards/EmptyCard";
import VoiceCards from "components/Cards/VoiceCards";
import { Spinner } from "components/Spinner/Spinner";
import { deleteDisplay } from "ducks/display";
import { setConfirm } from "ducks/modal";
import React, { Component } from "react";
import Masonry from "react-masonry-component";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";

class Multimodal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirm: null
    };

    this.deleteDisplay = this.deleteDisplay.bind(this);
  }

  deleteDisplay(id) {
    this.props.setConfirm({
      text: (
        <Alert color="warning" className="mb-0">
          Deleting this display will delete it from your project and all
          versions of it.
        </Alert>
      ),
      confirm: () => this.props.deleteDisplay(id)
    });
  }

  render() {
    if (this.props.loading) {
      return React.createElement(Spinner, { name: "Displays" });
    }
    return (
      <div className="h-100 w-100">
        <React.Fragment>
          {this.props.displays.length === 0 ? (
            <div className="super-center w-100 h-100">
              <div className="empty-container">
                <img src="/images/desktop.svg" alt="open safe" width="100" />
                <p className="empty">No Visual Templates Exist</p>
                <p className="empty-desc">
                  Add viduals to your project and create stunning visuals with
                  Alexa Presentation Language
                </p>
                <Link
                  to={`/visuals/${this.props.skill_id}/display/new`}
                  className="no-underline"
                >
                  <Button isPrimary varient="contained">
                    New Display
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-4 mx-3 mb-5 pt-3">
              <div className="products-container position-relative">
                <div className="space-between w-100 px-3">
                  <h5 className="text-muted mb-0">Visuals</h5>
                  <div>
                    <Link
                      to={`/canvas/${this.props.skill_id}`}
                      className="no-underline btn btn-secondary mr-2"
                    >
                      Back
                    </Link>
                    <Link
                      to={`/visuals/${this.props.skill_id}/display/new`}
                      className="no-underline btn btn-primary"
                    >
                      New Display
                    </Link>
                  </div>
                </div>
                <Masonry
                  elementType="div"
                  imagesLoadedOptions={{
                    columnWidth: "200",
                    itemSelector: ".grid-item"
                  }}
                >
                  {this.props.displays.map(display => {
                    let name = display.title.match(/\b(\w)/g);
                    if (name) {
                      name = name.join("");
                    } else {
                      name = display.title;
                    }
                    name = name.substring(0, 3);

                    return (
                      <VoiceCards
                        key={display.display_id}
                        id={display.display_id}
                        name={display.title}
                        placeholder={
                          <div className="no-image card-image">
                            <h1>{name}</h1>
                          </div>
                        }
                        onDelete={this.deleteDisplay}
                        deleteLabel="Delete Visual"
                        onClick={() =>
                          this.props.history.push(
                            `/visuals/${this.props.skill_id}/display/${display.display_id}`
                          )
                        }
                        buttonLabel="Edit Visual"
                      />
                    );
                  })}
                  <EmptyCard
                    onClick={() =>
                      this.props.history.push(
                        `/visuals/${this.props.skill_id}/display/new`
                      )
                    }
                  />
                </Masonry>
              </div>
            </div>
          )}
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  skill_id: state.skills.skill.skill_id,
  displays: state.displays.displays,
  loading: state.displays.loading
});

const mapDispatchToProps = dispatch => {
  return {
    deleteDisplay: display_id => dispatch(deleteDisplay(display_id)),
    setConfirm: confirm => dispatch(setConfirm(confirm))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Multimodal);
