const convertFontName = (font: string): string => {
  return font.toLowerCase().replace(/\s/g, "-");
};
export default convertFontName;
