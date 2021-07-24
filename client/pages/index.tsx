import { GetServerSideProps } from "next";
import { v4 } from "uuid";

export default function Home() {
  return <p>Redirecting...</p>;
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const randomDocumentId = v4();
  return {
    redirect: {
      destination: `/document/${randomDocumentId}`,
      permanent: false,
    },
  };
};
