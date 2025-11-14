import { ref } from 'vue';
import default_config from '../../../shared/config.json';

const config = ref(default_config);

LegacyLoader.api.config.get('LegacyLoader', default_config).then((cfg: typeof default_config) => {
	config.value = cfg;
});

const get = () => config.value;

const set = (config: any) => {
	config.value = {...default_config, ...config};
	LegacyLoader.api.config.set('LegacyLoader', config);
}

export { set as setSettings, get as getSettings }
export default {
	get,
	set
}
