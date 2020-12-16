import React, { useEffect, useState } from "react";
import { Button, Form, FormControl, Navbar, Table } from "react-bootstrap";
import { Redirect, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Toast from "../api/swal-toast";

interface User {
  id: number;
  username: string;
  password: string;
  privilege: string;
  policy: Policy;
}

interface Policy {
  id: number;
  name: string;
  add_permit: boolean;
  del_permit: boolean;
  update_permit: boolean;
}

const Home = () => {
  const history = useHistory();
  const [input, set_input] = useState({
    username: "",
    privilege: 0,
    password: "",
  });
  const [is_auth, set_auth] = useState(true);
  const [inner_button, set_inner_button] = useState("");
  const [user_data, set_user_data] = useState<any>([]);
  const [policies, set_policies] = useState<any>([]);
  const [loading, set_loading] = useState(true);

  const fetch_user = async () => {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    set_user_data(users);
    set_loading(false);
  };

  const fetch_policies = async () => {
    const response = await fetch("http://localhost:3000/policies");
    const policies = await response.json();
    set_policies(policies);
  };

  useEffect(() => {
    if (localStorage.username) {
      set_auth(true);
      set_inner_button(localStorage.username);
    } else {
      set_auth(false);
    }

    fetch_user();
    fetch_policies();
  }, []);

  useEffect(() => {
    // if (user_data) {
    //   let new_user_data: User[] = new Array;
    //   user_data.forEach((user: User) => {
    //     policies.forEach((policy: Policy) => {
    //       if (policy.id == user.id) {
    //         user.privilege = policy.name;
    //         new_user_data.push(user);
    //         return;
    //       };
    //     });
    //   });
    //   set_user_data(new_user_data);
    // }
  }, [policies]);

  const logout = (e: any) => {
    e.preventDefault();

    localStorage.clear();
    history.push("/login");
  };

  const change_button = (val: boolean) => {
    if (val) {
      set_inner_button("Logout");
    } else {
      set_inner_button(localStorage.username);
    }
  };

  const add = (e: any) => {
    e.preventDefault();

    const add_user = async () => {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: localStorage.access_token,
        },
        body: JSON.stringify(input),
      });

      switch (response.status) {
        case 201:
          Toast.fire({
            icon: "success",
            title: "User added!",
          });

          fetch_user();
          break;

        case 403:
          Swal.fire({
            icon: "error",
            title: "Access denied",
          });
          break;
      }
    };
    add_user();
  };

  const del = (e: any, id: number) => {
    e.preventDefault();

    const del_user = async () => {
      if (id == +localStorage.id) logout(e);
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          access_token: localStorage.access_token,
        },
        body: JSON.stringify(input),
      });

      switch (response.status) {
        case 200:
          Toast.fire({
            icon: "success",
            title: "User deleted!",
          });

          fetch_user();
          break;

        case 403:
          Swal.fire({
            icon: "error",
            title: "Access denied",
          });
          break;
      }
    };
    del_user();
  };

  return (
    <>
      <Navbar className="pad-navbar" bg="dark" variant="dark">
        <Navbar.Brand>Manage Users</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {is_auth ? (
            <Navbar.Text>
              Signed in as:{" "}
              <Button
                size="sm"
                variant="outline-light"
                onClick={logout}
                onMouseEnter={(_) => change_button(true)}
                onMouseLeave={(_) => change_button(false)}
              >
                {inner_button}
              </Button>
            </Navbar.Text>
          ) : (
            <Redirect to="/login" />
          )}
        </Navbar.Collapse>
      </Navbar>
      {!loading ? (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Privilege</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user_data.map((user: User, i: number) => {
              return (
                <tr key={user.id}>
                  <td>{i + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.policy.name}</td>
                  <td>
                    <Button
                      onClick={(e: any) => del(e, user.id)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            <tr key="USERINPUT">
              <td></td>
              <td className="put-mid">
                <FormControl
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="mr-5"
                  onChange={(e: any) => {
                    set_input({ ...input, username: e.target.value });
                  }}
                />
                <FormControl
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                  className="ml-3 mr-5"
                  type="password"
                  onChange={(e: any) => {
                    set_input({ ...input, password: e.target.value });
                  }}
                />
              </td>
              <td className="table-dropdown">
                <Form>
                  <Form.Group
                    className="pad-bot-zero"
                    controlId="exampleForm.SelectCustom"
                  >
                    <Form.Control
                      as="select"
                      custom
                      onChange={(e: any) =>
                        set_input({ ...input, privilege: +e.target.value })
                      }
                    >
                      {policies.map((policy: Policy, i: number) => {
                        return (
                          <option key={i} value={policy.id}>
                            {policy.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </td>
              <td>
                <Button variant="success" onClick={add}>
                  Add
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Home;
