import { useRouteError } from "react-router";
import Header from "../components/Header";
import PageLayout from "./PageLayout";

function NoPage() {

  return (
    <>
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold">Oops!</h1>
          <p className="mt-4 text-lg">
            Sorry, an unexpected error has occurred.
          </p>
          <p className="mt-2 text-sm text-gray-500">
          </p>
        </div>
      </PageLayout>
    </>
  );
}

export default NoPage;

