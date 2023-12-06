"use client";
import {
  useGetUsersQuery,
} from "@/lib/redux/services/user-api";

const UserNames = () => {
  const { isLoading, isFetching, data, error } = useGetUsersQuery(null);
  //
  return (
    <>
      <div>
        <h1> Users (names) from API loaded in a different component </h1>
      </div>
      {error ? (
        <p> There was an error fetching the data :/ </p>
      ) : isLoading || isFetching ? (
        <p> Loading ... </p>
      ) : (
        <ul>
          {data?.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default UserNames;
