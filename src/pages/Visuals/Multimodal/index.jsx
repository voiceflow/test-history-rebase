import '../Display.css';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import EmptyCard from '@/components/Cards/EmptyCard';
import VoiceCards from '@/components/Cards/VoiceCards';
import Button from '@/components/LegacyButton';
import { Spinner } from '@/components/Spinner';
import { allDisplaysSelector, deleteDisplay } from '@/ducks/display';
import { setConfirm } from '@/ducks/modal';
import { goToCurrentCanvas, goToDisplay, goToNewDisplay } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { RootRoutes } from '@/utils/routes';

class Multimodal extends Component {
  state = {
    confirm: null,
  };

  onDelete = (id) => {
    const { setConfirm, deleteDisplay } = this.props;

    setConfirm({
      text: 'Deleting this display will delete it from your project and all versions of it.',
      confirm: () => deleteDisplay(id),
    });
  };

  render() {
    const { loading, skillID, displays, goToNewDisplay, goToDisplay, goToCurrentCanvas } = this.props;

    if (loading) {
      return <Spinner name="Displays" />;
    }

    if (!displays.length) {
      return (
        <div className="super-center w-100 h-100">
          <div className="empty-container">
            <img src="/desktop.svg" alt="open safe" width="80" />
            <p className="empty">No Visual Templates Exist</p>
            <p className="empty-desc">Add visuals to your project with Alexa Presentation Language.</p>
            <Link to={`/${RootRoutes.PROJECT}/${skillID}/visuals/new`} className="no-underline">
              <Button isPrimary varient="contained">
                New Display
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 mx-3 mb-5 pt-3">
        <div className="products-container position-relative">
          <div className="space-between w-100 px-3">
            <h5 className="text-muted mb-0">Visuals</h5>
            <div>
              <Button isFlat varient="contained" className="mr-2" onClick={goToCurrentCanvas}>
                Back
              </Button>
              <Button isPrimary variant="contained" color="publish" iconPosition="right" onClick={goToNewDisplay}>
                New Display
              </Button>
            </div>
          </div>

          {displays.map((display) => {
            let name = display.name.match(/\b(\w)/g);
            if (name) {
              name = name.join('');
            } else {
              name = display.name;
            }
            name = name.substring(0, 3);

            return (
              <VoiceCards
                key={display.id}
                name={display.name}
                placeholder={
                  <div className="no-image card-image">
                    <h1>{name}</h1>
                  </div>
                }
                onDelete={() => this.onDelete(display.id)}
                deleteLabel="Delete Visual"
                onClick={() => goToDisplay(display.id)}
                buttonLabel="Edit Visual"
              />
            );
          })}
          <EmptyCard onClick={goToNewDisplay} />
        </div>
      </div>
    );
  }
}

Multimodal.propTypes = {
  deleteDisplay: PropTypes.func,
  setConfirm: PropTypes.func,
  loading: PropTypes.bool,
  projectID: PropTypes.string,
  displays: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = {
  skillID: activeSkillIDSelector,
  displays: allDisplaysSelector,
};

const mapDispatchToProps = {
  deleteDisplay,
  setConfirm,
  goToNewDisplay,
  goToDisplay,
  goToCurrentCanvas,
};

const mergeProps = ({ skillID }, { goToNewDisplay, goToDisplay, deleteDisplay }) => ({
  deleteDisplay: (displayID) => deleteDisplay(displayID),
  goToNewDisplay: () => goToNewDisplay(skillID),
  goToDisplay: (displayID) => goToDisplay(skillID, displayID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Multimodal);
