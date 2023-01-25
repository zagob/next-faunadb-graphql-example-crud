import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { CompletionTriggerKind } from "typescript";
import clsx from "clsx";

const fetcher = async (query: any) => await graphQLClient.request(query);

interface AllTodos {
  allTodos: {
    data: {
      _id: string;
      task: string;
      completed: boolean;
    }[];
  };
}

export default function Home() {
  const { data, mutate } = useSWR<AllTodos>(
    gql`
      {
        allTodos {
          data {
            _id
            task
            completed
          }
        }
      }
    `,
    fetcher
  );

  async function toggleTodo(id: string, completed: boolean) {
    const query = gql`
      mutation PartialUpdateTodo($id: ID!, $completed: Boolean!) {
        partialUpdateTodo(id: $id, data: { completed: $completed }) {
          _id
          completed
        }
      }
    `;

    const variables = {
      id,
      completed: !completed,
    };

    try {
      await graphQLClient.request(query, variables);
      mutate();
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteTodo(id: string) {
    const query = gql`
      mutation DeleteATodo($id: ID!) {
        deleteTodo(id: $id) {
          _id
        }
      }
    `;

    try {
      await graphQLClient.request(query, { id });
      mutate();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="font-bold text-xl pb-2">Next Fauna GraphQL CRUD</h1>
        <Link href="/new" className="underline">
          Create new Todo
        </Link>
      </div>

      {data ? (
        <ul className="">
          {data.allTodos.data.map((todo) => (
            <li key={todo._id} className="flex items-center gap-4 ">
              <span
                className={clsx("cursor-pointer", {
                  ["line-through"]: todo.completed,
                })}
                onClick={() => toggleTodo(todo._id, todo.completed)}
              >
                - {todo.task}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/todo/${todo._id}`}
                  className="text-gray-400 hover:brightness-200"
                >
                  Edit
                </Link>
                |
                <button
                  className="text-sm text-red-400"
                  type="button"
                  onClick={() => deleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span>Loading...</span>
      )}
    </Layout>
  );
}
