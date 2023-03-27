
import container from 'markdown-it-container'


export const containerPlugin = (md) => {
    md.use(...createContainer('tip', 'TIP', md))
        .use(...createContainer('info', 'INFO', md))
        .use(...createContainer('warning', 'WARNING', md))
        .use(...createContainer('danger', 'DANGER', md))
        .use(...createContainer('details', 'Details', md))
        // explicitly escape Vue syntax
        .use(container, 'v-pre', {
            render: (tokens, idx) =>
                tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`
        })
        .use(container, 'raw', {
            render: (tokens, idx) =>
                tokens[idx].nesting === 1 ? `<div class="vp-raw">\n` : `</div>\n`
        })
}

function createContainer(
    klass,
    defaultTitle,
    md
){
    return [
        container,
        klass,
        {
            render(tokens, idx) {
                const token = tokens[idx]
                const info = token.info.trim().slice(klass.length).trim()
                if (token.nesting === 1) {
                    const title = md.renderInline(info || defaultTitle)
                    if (klass === 'details') {
                        return `<details class="${klass} custom-block"><summary>${title}</summary>\n`
                    }
                    return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p>\n`
                } else {
                    return klass === 'details' ? `</details>\n` : `</div>\n`
                }
            }
        }
    ]
}

