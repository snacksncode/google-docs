import convertFontName from "../../utils/convertFontName";

export interface Config {
  formats: string[];
  toolbar: any[][];
  fonts: string[];
  fontSizes: string[];
  saveInterval: number;
}

const FONTS = [
  "Arial",
  "Courier",
  "Garamond",
  "Tahoma",
  "Times New Roman",
  "Verdana",
  "Roboto",
  "Montserrat",
  "Poppins",
  "DM Mono",
];

const ALLOWED_FORMATS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "list",
  "indent",
  "size",
  "header",
  "link",
  "image",
  "video",
  "font",
  "blockquote",
  "formula",
  "link",
  "color",
  "background",
  "clean",
  "code-block",
  "script",
];

const CUSTOM_FONT_SIZES = [
  "9px",
  "10px",
  "11px",
  "12px",
  "13px",
  "14px",
  "18px",
  "24px",
  "36px",
  "48px",
  "64px",
  "72px",
  "96px",
  "144px",
  "288px",
];

const TOOLBAR_OPTIONS = [
  [{ font: FONTS.map(convertFontName) }, { size: CUSTOM_FONT_SIZES }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  // [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }, { align: [] }], // outdent/indent
  ["link", "image", "formula", { script: "sub" }, { script: "super" }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme

  ["clean"], // remove formatting button
];

const SAVE_INTERVAL_MS = 5000;

const config: Config = {
  formats: ALLOWED_FORMATS,
  toolbar: TOOLBAR_OPTIONS,
  fontSizes: CUSTOM_FONT_SIZES,
  fonts: FONTS,
  saveInterval: SAVE_INTERVAL_MS,
};

export default config;
