'use strict';

var React = require('react');
var Router = require('react-router');

var authorizationStore = require('../stores/authorization-store');
var Console = require('./console');
var consoleActionCreators = require('../action-creators/console-action-creators');
var consoleStore = require('../stores/console-store');
var Navigation = require('./navigation');

var PlatformManager = React.createClass({
    mixins: [Router.Navigation, Router.State],
    getInitialState: getStateFromStores,
    componentDidMount: function () {
        authorizationStore.addChangeListener(this._onStoreChange);
        consoleStore.addChangeListener(this._onStoreChange);
    },
    componentWillUnmount: function () {
        authorizationStore.removeChangeListener(this._onStoreChange);
        consoleStore.removeChangeListener(this._onStoreChange);
    },
    _onStoreChange: function () {
        this.setState(getStateFromStores());
    },
    _onButtonClick: function () {
        consoleActionCreators.toggleConsole();
    },
    render: function () {
        var classes = ['platform-manager'];

        if (this.state.consoleShown) {
            classes.push('platform-manager--console-open');
        }

        if (this.state.loggedIn) {
            classes.push('platform-manager--logged-in');
        } else {
            classes.push('platform-manager--not-logged-in');
        }

        return (
            <div className={classes.join(' ')}>
                <div className="main">
                    <Navigation />
                    <Router.RouteHandler />
                </div>
                <input
                    className="toggle"
                    type="button"
                    value={'Console ' + (this.state.consoleShown ? '\u25bc' : '\u25b2')}
                    onClick={this._onButtonClick}
                />
                {this.state.consoleShown && <Console className="console" />}
            </div>
        );
    },
});

function getStateFromStores() {
    return {
        consoleShown: consoleStore.getConsoleShown(),
        loggedIn: !!authorizationStore.getAuthorization(),
    };
}

module.exports = PlatformManager;