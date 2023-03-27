import {createMarkdownRenderer} from "./markdown.js";

export async function render(rawText){
    const md = await createMarkdownRenderer();
    return md.render(rawText, {});
}
