import { Schema, model } from "mongoose";

const Document = new Schema({
  _id: String,
  data: Object,
});

const DocumentModel = model("Document", Document);

export default DocumentModel;
