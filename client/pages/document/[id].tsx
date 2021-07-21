import { useRouter } from "next/dist/client/router";
import TextEditor from "../../components/TextEditor";

const Document = () => {
  const router = useRouter();
  const id = router.query.id as string;
  return <TextEditor documentId={id} />;
};

export default Document;
