export default function StylesSheet(href){
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    return link;
}