"use client";
import UserNames from "@/components/users";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetUsersQuery } from "@/lib/redux/services/user-api";

const UserList = () => {
  const users = useAppSelector((state) => state["feature/users"].test);
  const { isLoading, isFetching, data, error } = useGetUsersQuery(null);
  //
  return (
    <>
      <div>
        <h1> Users from API </h1>
      </div>
      {error ? (
        <p> There was an error fetching the data :/ </p>
      ) : isLoading || isFetching ? (
        <p> Loading ... </p>
      ) : (
        <>
          <ul>
            {data?.map((user) => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        </>
      )}
      <UserNames />
      <div>
        <h1> Users from redux slice </h1>
      </div>
      <>
        <ul>
          {users?.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </>
    </>
  );
};

export default UserList;
