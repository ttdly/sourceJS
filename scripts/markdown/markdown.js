
import MarkdownIt from 'markdown-it'
import anchorPlugin from 'markdown-it-anchor'
import attrsPlugin from 'markdown-it-attrs'
import emojiPlugin from 'markdown-it-emoji'
import { containerPlugin } from './plugins/container.js'
import { preWrapperPlugin } from './plugins/preWrapper.js'
import {highlight} from "./plugins/highlight.js";

export const createMarkdownRenderer = async () => {
    const md = MarkdownIt({
        html: true,
        linkify: true,
        highlight:
            (await highlight(
                'vitesse-dark',
                [],
                '',
                {}
            ))
    })
    md.linkify.set({ fuzzyLink: false })
    md.use(preWrapperPlugin)
        .use(containerPlugin)
    md.use(attrsPlugin)
    md.use(emojiPlugin)

    md.use(anchorPlugin)

    return md
}
