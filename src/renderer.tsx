import path from 'path';
import SitesSidebarSearch from './SitesSidebarSearch';

export default async function (context) {
	const { React, hooks } = context;

	const stylesheetPath = path.resolve(__dirname, '../style.css');
	hooks.addContent('stylesheets', () => <link rel="stylesheet" key="dekode-styleesheet" href={stylesheetPath} />);
	/**
	 * Add search to sidebar.
	 */
	hooks.addContent('SitesSidebar_SiteList:Before', () => <SitesSidebarSearch key="siteinfo" />);

}
