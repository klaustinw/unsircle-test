import React, { useEffect, useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Toast from "../api/swal-toast";

interface LoginInfo {
  access_token: string,
  username: string,
  id: number
}

const Login = () => {
  const history = useHistory();
  const [input, set_input] = useState({ username: "", password: "" });

  useEffect(() => {
    if (localStorage.access_token) {

    }
  }, []);

  const submit = (e: any) => {
    e.preventDefault();
    const login = async () => {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "access_token": localStorage.access_token
        },
        body: JSON.stringify(input),
      });
      const data: LoginInfo = await response.json();

      switch (response.status) {
        case 200:
          Toast.fire({
            icon: "success",
            title: "Welcome back!"
          });

          localStorage.access_token = data.access_token;
          localStorage.username = data.username;
          localStorage.id = data.id;
          history.push("/");
          break;

        case 401:
          Swal.fire({
            icon: "error",
            title: "Incorrect login credentials",
          });
          break;
      }
    };

    login();
  };

  return (
    <header className="login-box">
      <h1>Login</h1>
      <div>
        <form onSubmit={submit}>
          <InputGroup size="lg" className="mb-3 pt-4">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) =>
                set_input({ ...input, username: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup size="lg" className="mb-1 pt-1">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">**</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              type="password"
              onChange={(e) =>
                set_input({ ...input, password: e.target.value })
              }
            />
          </InputGroup>
          <Button className="mt-3" size="lg" type="submit" onClick={(e) => {}}>
            Submit
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Login;
