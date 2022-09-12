import React from 'react';
import { Form } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export interface IProfileButtonProps {

}

export default function ProfileButton(props: IProfileButtonProps) : JSX.Element | null {
  const user = useOptionalUser();
  if(!user) return null;
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src={`https://i.pravatar.cc/80?u=${user.email}`} />
        </div>
      </label>
      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52">
        <div className="px-2 mt-4">
          <p>{user.email}</p>
        </div>
        <div className="divider"></div>
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <Form action="/logout" method="post">
          <li><button
            type="submit"
            className="a"
          >
            Logout
          </button></li>
        </Form>
      </ul>
    </div>
  )
}