import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Station from './pages/Station';
import Home from './pages/Home';

const App = () => (
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

export default App;