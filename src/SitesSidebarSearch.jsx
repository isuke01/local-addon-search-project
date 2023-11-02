import React, { useState, useEffect, useRef } from 'react';
import { BasicInput, Close } from '@getflywheel/local-components';
import { ipcRenderer } from 'electron';

export default function SitesSidebarSearch() {
	const [search, setSearch] = useState('');
	const [sites, setSites] = useState(null);
	const [matchingSites, setMatchingSites] = useState([]);
	const inputRef = useRef(null);

	useEffect(() => {
		ipcRenderer.send('fetch-sites');

		ipcRenderer.once('get-sites', (event, value) => {
			setSites(value);
		});

		ipcRenderer.on('render-search', (event, value) => {
			setSearch(value);
		});
	}, []);

	useEffect(() => {
		if (search && sites) {
			const sitesArray = Object.values(sites);
			const searchQuery = search.toLowerCase();

			const filteredSites = sitesArray.filter(({ name }) => name?.toLowerCase().includes(searchQuery));

			setMatchingSites(filteredSites);
		}
	}, [search, sites]);

	const handleSearch = (value) => {
		setSearch(value);
	};

	const dynamicStyles = search.length > 1
		? matchingSites.map(({ name }) => `#SiteList a[data-site-name="${name}"]`).join(',\n') + ' {\n  display: block;\n}'
		: '';

	return (
		<div className="site-search">
			<BasicInput
				ref={inputRef}
				minLength={2}
				placeholder="Search for a site..."
				value={search}
				onChange={(e) => handleSearch(e.target.value)}
			/>
			{search.length > 1 && (
				<>
				<style>
					{`
					#SiteList a {
						display: none;
					}
					`}
					{dynamicStyles}
				</style>
				<Close onClick={() => setSearch('')} />
				</>
			)}
		</div>
	);
}
