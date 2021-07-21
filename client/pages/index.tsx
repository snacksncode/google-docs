import { GetServerSideProps } from "next";
import { uuid } from "uuidv4";

export default function Home() {
  return <p>Redirecting...</p>;
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const randomDocumentId = uuid();
  return {
    redirect: {
      destination: `/document/${randomDocumentId}`,
      permanent: false,
    },
  };
};
