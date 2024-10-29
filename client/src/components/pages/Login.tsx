import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { PasswordInput, TextInput } from "../util/Input";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { getAccessTokens } from "../../util/misc";

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const [cookie] = useCookies(["token"]);

  let swap = () => setIsSignIn(!isSignIn);

  useEffect(() => {
    if (cookie.token !== undefined) navigate("/");
  }, []);
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="grid grid-cols-2 grid-rows-1">
          <div className="flex h-[32rem] w-96 flex-col items-center justify-center gap-4 rounded-l-lg bg-light-background">
            {isSignIn ? (
              <SignInSide />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-l-lg bg-secondary">
                <div className="text-6xl">Welcome</div>
                <div className="mb-6 text-2xl">Already have an account?</div>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: "rgba(var(--primary))",
                    borderRadius: 2,
                    textTransform: "capitalize",
                    color: "rgba(var(--text))",
                  }}
                  onClick={swap}
                >
                  <span className="mx-4 my-2 text-2xl">Sign in</span>
                </Button>
              </div>
            )}
          </div>
          <div className="flex h-[32rem] w-96 flex-col items-center justify-center gap-2 rounded-r-lg bg-light-background">
            {!isSignIn ? (
              <SignUpSide />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-r-lg bg-secondary">
                <div className="text-6xl">Welcome</div>
                <div className="mb-6 text-2xl">Don't have an account?</div>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: "rgba(var(--primary))",
                    borderRadius: 2,
                    textTransform: "capitalize",
                    color: "rgba(var(--text))",
                  }}
                  onClick={swap}
                >
                  <span className="mx-4 my-2 text-2xl">Sign up</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SignInSide() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();
  const [, setCookie] = useCookies(["token", "access_token"]);
  const navigate = useNavigate();

  async function SignIn() {
    if (username === "") {
      enqueueSnackbar("Enter a username");
      return;
    }
    if (password === "") {
      enqueueSnackbar("Enter a password");
      return;
    }
    const response = await fetch("http://localhost:8000" + "/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      enqueueSnackbar(data.message, { variant: "error" });
      return;
    }
    const access_token_data = await getAccessTokens(data.token);
    if (access_token_data === null) {
      enqueueSnackbar("Could not log in", { variant: "error" });
      return;
    }

    setCookie("token", { token: data.token }, { maxAge: 60 * 60 * 24 });
    setCookie(
      "access_token",
      { access_token: access_token_data.access_token },
      { maxAge: access_token_data.expires_in }
    );
    enqueueSnackbar(data.message, { variant: "success" });
    navigate("/");
  }

  return (
    <>
      <div className="mb-8 w-full px-16 text-start text-5xl text-text">
        Sign in
      </div>
      <TextInput
        placeholder="Username"
        value={username}
        setValue={setUsername}
      />
      <PasswordInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
      />
      <FormControlLabel control={<Checkbox />} label="Remember me" />
      <div className="mt-6 flex w-full justify-center">
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "rgba(var(--primary))",
            borderRadius: 2,
            textTransform: "capitalize",
            color: "rgba(var(--text))",
          }}
          onClick={SignIn}
        >
          <span className="mx-4 my-2 text-2xl">Sign in</span>
        </Button>
      </div>
    </>
  );
}
function SignUpSide() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const [, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  async function SignUp() {
    if (username === "") {
      enqueueSnackbar("Enter a username");
      return;
    }
    if (email === "") {
      enqueueSnackbar("Enter an email");
      return;
    }
    if (password === "") {
      enqueueSnackbar("Enter a password");
      return;
    }
    if (confirmPassword !== password) {
      enqueueSnackbar("Passwords dont match");
      return;
    }
    const response = await fetch("http://localhost:8000" + "/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      enqueueSnackbar(data.message, { variant: "error" });
      return;
    }

    setCookie("token", { token: data.token }, { maxAge: 60 * 60 * 24 });
    enqueueSnackbar(data.message, { variant: "success" });
    navigate("/");
  }
  return (
    <>
      <div className="mb-8 w-full px-12 text-start text-5xl text-text">
        Sign up
      </div>
      <TextInput
        placeholder="Username"
        value={username}
        setValue={setUsername}
      />
      <TextInput placeholder="Email" value={email} setValue={setEmail} />
      <PasswordInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
      />
      <PasswordInput
        placeholder="Confirm Password"
        value={confirmPassword}
        setValue={setConfirmPassword}
      />
      <div className="mt-6 flex w-full justify-center">
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "rgba(var(--primary))",
            borderRadius: 2,
            textTransform: "capitalize",
            color: "rgba(var(--text))",
          }}
          onClick={SignUp}
        >
          <span className="mx-4 my-2 text-2xl">Sign up</span>
        </Button>
      </div>
    </>
  );
}

export default Login;
