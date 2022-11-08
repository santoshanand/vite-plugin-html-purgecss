import { PurgeCSS, UserDefinedSafelist } from 'purgecss';
import { PluginOption } from 'vite';
export default function purgeHtml(safeList?: UserDefinedSafelist) : PluginOption {
    let _html: string = '';
    return {
        name: 'vite-plugin-html-purgecss-v3',
        enforce: 'post',
        transformIndexHtml(html) { _html += html; },
        async generateBundle(_options, bundle) {
            const cssFiles = Object.keys(bundle).filter(key => key.endsWith('.css'));
            if (!cssFiles) return;
            for (const file of cssFiles) {
                const purged = await new PurgeCSS().purge({
                    content: [{ raw: _html, extension: 'html' }],
                    css: [{ raw: bundle[file].fileName }],
                    safelist: safeList || []
                });
                bundle[file].fileName = purged[0].css;
            }
        }
    }
}
