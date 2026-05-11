export function trocaTema(theme) {
  const link = document.getElementById("dx-theme");
  if (link) {
    link.href = `/themes/${theme}.css`;
  }
}