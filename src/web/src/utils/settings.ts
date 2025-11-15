import default_config from '../../../shared/config.json';

const get = async() => await LegacyLoader.api.config.get('LegacyLoader', default_config);

const set = async(new_config: any) => {
	LegacyLoader.api.config.set('LegacyLoader', {...(await get()), ...new_config});
}

export { set as setSettings, get as getSettings}
export default {
	get,
	set
}
