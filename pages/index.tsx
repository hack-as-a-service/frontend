import Head from "next/head";
import { IndexPage } from "../stories/IndexPage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hack as a Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <IndexPage/>
    </>
  );
}


