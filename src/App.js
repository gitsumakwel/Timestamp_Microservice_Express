import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import './index.css';
//import App from './App';
import $ from 'jquery';
//constants and variables
const INPUTSTATE = {
  input:''
}

const INPUT = 'INPUT';

//Redux
//Action
const actionInput = (input) => {
  return {
    type: 'INPUT',
    input: input,
  }
}

//Reducer
const systemReducer = (state = INPUTSTATE,action) => {
  const newState = Object.assign({},state);
  switch (action.type) {
    case INPUT :
      newState.input = action.input;
      return newState;
    default:
      return state;
  }  
}

//React Redux
const rootReducer = combineReducers({
  system: systemReducer,
});

//Store
const store = createStore(rootReducer,applyMiddleware(ReduxThunk.default));


//React
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentsDidMount() {

  }
  render() {
    return (
      <div>
        Display
      </div>
    )
  }
}



const mapStateToProps = (state) => {
  return {state:state}
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchBreak: (input)=>{dispatch(actionInput(input))},
  }
}

const ConnControls = connect(mapStateToProps, mapDispatchToProps)(Controls);
const ConnApp = connect(mapStateToProps, mapDispatchToProps)(App);
class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnApp/>
      </Provider>
    );
  }
};


//ReactDOM.render(<AppWrapper/>,document.getElementById('root'));


export default AppWrapper;