// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';

export default function (context) {
	const { electron } = context;
	const { ipcMain } = electron;

	// fetch all local sites.
	ipcMain.on('fetch-sites', async (event, value) => {
		const sites = LocalMain.SiteData.getSites();

		LocalMain.sendIPCEvent('get-sites', sites);
		return sites;
	});
}
