import { Layout } from "@/components/Layout";
import { graphQLClient } from "@/utils/graphql-client";
import { gql } from "graphql-request";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  task: string;
}

export default function New() {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  async function handleSubmitForm({ task }: FormData) {
    const query = gql`
      mutation CreateATodo($task: String!) {
        createTodo(data: { task: $task, completed: false }) {
          task
          completed
        }
      }
    `;

    try {
      await graphQLClient.request(query, { task });
      Router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <h1 className="pb-6 text-xl font-bold">Create New Todo</h1>
      <Link href="/">Back</Link>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="w-[500px] flex flex-col items-start gap-4 bg-zinc-800 px-4 py-8 rounded"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="">Task</label>
          <input
            type="text"
            className="pl-2 border-none bg-zinc-600 text-gray-200 outline-none rounded py-2"
            placeholder="e.g. do something"
            {...register("task", {
              required: "Task is required",
            })}
          />
          <span className="text-xs text-red-400 font-bold">
            {errors.task?.message}
          </span>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-green-800 px-10 py-2 disabled:opacity-40"
        >
          Create
        </button>
      </form>
    </Layout>
  );
}
