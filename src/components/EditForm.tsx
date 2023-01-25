import { graphQLClient } from "@/utils/graphql-client";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditFormProps {
  id: string;
  defaultValues: {
    task: string;
    completed: boolean;
  };
}

interface SubmitFormData {
  task: string;
  completed: boolean;
}

export function EditForm({ defaultValues, id }: EditFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SubmitFormData>({
    defaultValues: {
      ...defaultValues,
    },
  });

  async function handleSubmitForm({ task, completed }: SubmitFormData) {
    const query = gql`
      mutation UpdateATodo($id: ID!, $task: String!, $completed: Boolean!) {
        updateTodo(id: $id, data: { task: $task, completed: $completed }) {
          task
          completed
        }
      }
    `;

    const variables = {
      id,
      task,
      completed,
    };

    try {
      await graphQLClient.request(query, variables);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-col items-start gap-6"
    >
      <div className="flex flex-col">
        <label className="text-lg font-bold">Task</label>
        <input
          type="text"
          className="pl-2 border-none bg-zinc-600 text-gray-200 outline-none rounded py-2"
          {...register("task", { required: "Task is required" })}
        />
        <span>{errors.task?.message}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="completed"
          type="checkbox"
          className="appearance-none w-6 h-6 peer bg-zinc-500 rounded-md relative checked:bg-green-400 checked:after:content-['✓'] checked:after:text-black checked:after:text-2xl flex items-center justify-center"
          {...register("completed")}
        />
        <label htmlFor="completed" className="peer-checked:line-through">
          Completed
        </label>
      </div>

      <button
        disabled={false}
        type="submit"
        className="bg-green-800 px-10 py-2 disabled:opacity-40"
      >
        Update
      </button>
    </form>
  );
}
