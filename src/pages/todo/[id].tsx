import { EditForm } from "@/components/EditForm";
import { Layout } from "@/components/Layout";
import { graphQLClient } from "../../utils/graphql-client";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface EditTodoProps {
  id: string;
}

interface QueryFindTodoByID {
  findTodoByID: {
    task: string;
    completed: boolean;
  };
}

export default function EditTodo({ id }: EditTodoProps) {
  const router = useRouter();
  //   const { id } = router.query

  const query = gql`
    query FindATodoByID($id: ID!) {
      findTodoByID(id: $id) {
        task
        completed
      }
    }
  `;

  const fetcher = async () => await graphQLClient.request(query, { id });

  //   const { data, isLoading, error } = useQuery({
  //     queryKey: ["getTodoID", id],
  //     queryFn: fetcher,
  //   });

  const { data, error, isLoading } = useSWR<QueryFindTodoByID>(
    [query, id],
    fetcher
  );

  return (
    <Layout>
      {isLoading ? (
        <div>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <Link href="/" className="underline">
            Back
          </Link>
          <span className="text-white">{JSON.stringify(error)}</span>
          {data ? (
            <EditForm defaultValues={data.findTodoByID} id={id} />
          ) : (
            <span>Error</span>
          )}
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  return {
    props: {
      id,
    },
  };
};
