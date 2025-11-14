/// <reference types="vite/client" />
import { LegacyLoaderRenderer } from '../../types';

declare global {
	const __APP_VERSION__: string;
	const __WEBUI_VERSION__: string;

	const LegacyLoader: LegacyLoaderRenderer;
	const LiteLoader: LegacyLoaderRenderer;
}
