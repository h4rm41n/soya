import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import smokesignals from 'soya/lib/event/smokesignals';
import Form from 'soya/lib/data/redux/form/Form';
import FormSegment from 'soya/lib/data/redux/form/FormSegment';

// TODO: Figure out how to do promise polyfill.
import style from '../../../shared/sitewide.css';

import WishlistForm from '../../../components/contextual/WishlistForm/WishlistForm';
import TextField from '../../../components/common/TextField/TextField.js';

const FORM_ID = 'wishlist';

class Component extends React.Component {
  componentWillMount() {
    this.actions = this.props.context.reduxStore.register(FormSegment);
    this._form = new Form(this.props.context.reduxStore, FORM_ID);
  }

  render() {
    return <div>
      <h1>Repeatable Form</h1>
      <h3>Complex Form Data Structure</h3>
      <ul>
        <li>We can have maps <code>(goals.professional)</code>, and map inside of map <code>(goals.material.lodging)</code>.</li>
        <li>We can have lists <code>(games)</code>, and list inside of list <code>(visited[0][1])</code>.</li>
        <li>We can have maps inside of lists <code>(games[0].name)</code> and lists inside of maps <code>(games[0].reviews)</code>.</li>
        <li>We can have repeatable inside of another repeatable field set (multiple <code>reviews</code> inside of <code>game</code>).</li>
        <li>We can <a href="javascript:void(0)" onClick={this.setValues.bind(this)}>set values</a>, making items in array appears.</li>
      </ul>
      <WishlistForm formName="Personal Wishlist" form={this._form} context={this.props.context} />
      <h3>Repeatable Fields</h3>
      <ul>
        <li>Forms are able to easily create custom object hierarchies.</li>
        <li>Forms are able to easily repeat a set of fields to create a <code>List&lt;T&gt;</code> structure.</li>
      </ul>
      <DebugPanel top right bottom>
        <DevTools store={this.props.context.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }

  setValues() {
    this.props.context.reduxStore.dispatch(this.actions.setValues(FORM_ID, [
      { fieldName: ['goals', 'professional'], value: 'Entrepreneur' },
      { fieldName: ['goals', 'material', 'lodging'], value: 'Simple home' },
      { fieldName: ['goals', 'material', 'electronics'], value: '' },
      { fieldName: ['goals', 'material', 'furniture'], value: 'Minimalist' },
      { fieldName: ['visited', 0, 0], value: 'Bali' },
      { fieldName: ['visited', 1, 0], value: 'Augsburg' },
      { fieldName: ['games', 1, 'name'], value: 'Homeworld Remastered' },
      { fieldName: ['games', 1, 'genre'], value: 'Real Time Strategy' },
      { fieldName: ['games', 1, 'reviews', 0, 'reviewer'], value: 'Rock Paper Shotgun' },
      { fieldName: ['games', 1, 'reviews', 0, 'score'], value: 'Amazing' },
      { fieldName: ['games', 1, 'reviews', 1, 'reviewer'], value: 'IGN' },
      { fieldName: ['games', 1, 'reviews', 1, 'score'], value: '9/10' }
    ]));
  }
}

class RepeatableForm extends Page {
  static get pageName() {
    return 'RepeatableForm';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config, this.cookieJar);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Repeatable Form Test</title>';
    reactRenderer.body = React.createElement(Component, {
      context: {
        reduxStore: store,
        config: this.config
      }
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(RepeatableForm);
export default RepeatableForm;