import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import { Sources } from "quill";
import katex from "katex";
import "katex/dist/katex.min.css";
import config from "./config";
import convertFontName from "../../utils/convertFontName";

interface Props {
  documentId: string;
}

const TextEditor = ({ documentId }: Props) => {
  const { quill, quillRef, Quill } = useQuill({
    theme: "snow",
    modules: {
      syntax: {
        highlight: (text: any) => hljs.highlightAuto(text).value,
      },
      toolbar: config.toolbar,
    },
    formats: config.formats,
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  // Disable editor while loading
  useEffect(() => {
    if (quill == null) return;
    quill.disable();
    quill.setText("Loading...");
  }, [quill]);
  // Register Custom Font Sizes
  useEffect(() => {
    if (Quill == null) return;
    const fontSizeArr = config.fontSizes;

    var Size = Quill.import("attributors/style/size");
    Size.whitelist = fontSizeArr;
    Quill.register(Size, true);
  }, [Quill]);

  // Register Custom Fonts
  useEffect(() => {
    if (Quill == null) return;
    const fontsToLoad = config.fonts;
    // Specify Quill fonts
    const fontNames = fontsToLoad.map((font) => convertFontName(font));
    const fonts = Quill.import("attributors/class/font");
    fonts.whitelist = fontNames;
    Quill.register(fonts, true);

    // Add fonts to CSS style
    let fontStyles = "";
    fontsToLoad.forEach((font) => {
      const fontName = convertFontName(font);
      fontStyles +=
        ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" +
        fontName +
        "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" +
        fontName +
        "]::before {" +
        "content: '" +
        font +
        "';" +
        "font-family: '" +
        font +
        "', sans-serif;" +
        "}" +
        ".ql-font-" +
        fontName +
        "{" +
        " font-family: '" +
        font +
        "', sans-serif;" +
        "}";
    });
    let styleElement = document.createElement("style");
    styleElement.innerHTML = fontStyles;
    document.body.appendChild(styleElement);
  }, [Quill]);

  // Receive Changes Event
  useEffect(() => {
    if (quill == null || socket == null) return;

    const onReceiveChanges = (delta: any) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", onReceiveChanges);

    return () => {
      socket.off("receive-changes", onReceiveChanges);
    };
  }, [quill, socket]);

  // Save document to database
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, config.saveInterval);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // Text Change Event
  useEffect(() => {
    if (quill == null || socket == null) return;

    const onTextChange = (delta: any, _oldDelta: any, source: Sources) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", onTextChange);

    return () => {
      quill.off("text-change", onTextChange);
    };
  }, [quill, socket]);

  // Make formulas work (register katex on window object)
  useEffect(() => {
    window.katex = katex;
  }, []);

  // connect user to a specific room
  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [quill, socket, documentId]);

  // Connect to server via socket (executed once)
  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("connect", () => {
      setSocket(socket);
      console.log(
        "%c Connected ",
        "color: #222; background-color: lightgreen; border-radius: 2px; font-weight: 700",
        `Socket ID: ${socket.id}`
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <div ref={quillRef} />
    </div>
  );
};

export default TextEditor;
