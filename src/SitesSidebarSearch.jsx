import {
	BasicInput,
	Close
} from '@getflywheel/local-components';

import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

export default class SitesSidebarSearch extends Component {
	constructor (props) {
		super(props);

		this.state = {
			search: '',
			sites: null,
			siteFound: '',
		};
	}

	componentDidUpdate (previousProps, prevState) {
		ipcRenderer.once('render-search', (event, value) => {
			this.setState({ search: value });
		});

		if (this.state.search && this.state.sites && prevState.search !== this.state.search) {
			if (this.state.search?.length < 2) {
				return;
			}

			const currentSites = this.state.sites;
			const sitesArray = Object.values(currentSites);

			let siteSearch = '';
			sitesArray.forEach((site) => {
				if (site?.name?.toLowerCase().includes(this.state?.search?.toLowerCase())) {
					if (prevState.siteFound !== site.name) {
						siteSearch = site.name;
						return;
					}
				}
			});

			if (siteSearch) {
				this.setState({
					siteFound: siteSearch,
				});
			}
		}
	}

	componentDidMount() {
		ipcRenderer.send('fetch-sites');

		ipcRenderer.once('get-sites', (event, value) => {
			this.setState({ sites: value });
		});
	}

	handleSearch( value ) {
		this.setState({ search: value });
	}

	// Add search functionality to the sidebar
	render () {
		return (
			<div className="site-search">
				<BasicInput
					minlength={2}
					placeholder="Search for a site..."
					value={this.state.search}
					onChange={ (e) => this.setState({ search: e.target.value }) }
				/>
				{ this.state.search?.length > 2 && (
					<>
						<style>
							{ `
								nav a:not([data-site-name="${this.state.siteFound}"]) {
									display: none;
								}
							` }
						</style>
						<Close onClick={() => this.setState({ search: '' })} />
					</>
				) }
			</div>
		);
	}
}
