export default function clearHtmlFromString(strWithHtml: string) {
  return strWithHtml.replace(/<\/?[^>]+(>|$)/g, "");
}
