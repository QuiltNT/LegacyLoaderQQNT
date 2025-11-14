import { DialogToast } from 'v-dialogs';

function compareVersions(v1: string, v2: string) {
    const v1Parts = v1.split(/[.-]/).map((part: string) => isNaN(Number(part)) ? 0 : Number(part));
    const v2Parts = v2.split(/[.-]/).map((part: string) => isNaN(Number(part)) ? 0 : Number(part));
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const p1 = v1Parts[i] || 0;
        const p2 = v2Parts[i] || 0;
        if (p1 !== p2) return p1 < p2;
    }
    return false;
}

export default() => {
	try {
	const current_version = LegacyLoader.versions.legacyloader;
	fetch(`${LegacyLoader.package.legacyloader.repository.url.replace('.git', '')}/releases/latest`)
		.then(res => {
			const latest_version = res.url.split('/').pop()!;
			if(compareVersions(latest_version, current_version)) {
				DialogToast(`发现新版本 ${latest_version}`, () => LegacyLoader.api.openExternal(res.url), {
					duration: 0
				});
			}
		});
	} catch(e: any) {
		DialogToast(`检查更新失败: ${e.message}`, new Function, {
			messageType: 'error',
			duration: 3000
		});
	}
};
