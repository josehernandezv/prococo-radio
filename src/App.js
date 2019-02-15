import React, { Component } from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Station from './containers/Station';
import Home from './containers/Home';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Layout>
					<Switch>
						<Route path="/station" exact component={ Station } />
						<Route path="/" exact component={ Home } />
						<Redirect to="/" />
					</Switch>
				</Layout>
			</BrowserRouter>
		);
	}
}

export default App;