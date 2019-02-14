import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout';
import Station from './containers/Station';
import Home from './containers/Home';

class App extends Component {
	render() {
		return (
			<Layout>
				<Home />
				{/* <Station /> */}
			</Layout>
		);
	}
}

export default App;