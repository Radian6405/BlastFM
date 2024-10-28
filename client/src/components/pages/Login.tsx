import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { PasswordInput, TextInput } from "../util/Input";
import { useState } from "react";

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  let swap = () => setIsSignIn(!isSignIn);
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="grid grid-cols-2 grid-rows-1">
          <div className="bg-light-background flex h-[30rem] w-96 flex-col items-center justify-center gap-4 rounded-l-lg">
            {isSignIn ? (
              <SignInSide />
            ) : (
              <div className="bg-secondary flex h-full w-full flex-col items-center justify-center gap-4 rounded-l-lg">
                <div className="text-6xl">Welcome</div>
                <div className="text-2xl mb-6">Already have an account?</div>
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
          <div className="bg-light-background flex h-[30rem] w-96 flex-col items-center justify-center gap-4 rounded-r-lg">
            {!isSignIn ? (
              <SignOutSide />
            ) : (
              <div className="bg-secondary flex h-full w-full flex-col items-center justify-center gap-4 rounded-r-lg">
                <div className="text-6xl">Welcome</div>
                <div className="text-2xl mb-6">Don't have an account?</div>
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
  return (
    <>
      <div className="text-text mb-8 w-full px-16 text-start text-5xl">
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
        >
          <span className="mx-4 my-2 text-2xl">Sign in</span>
        </Button>
      </div>
    </>
  );
}
function SignOutSide() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  return (
    <>
      <div className="text-text mb-8 w-full px-12 text-start text-5xl">
        Sign up
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
        >
          <span className="mx-4 my-2 text-2xl">Sign up</span>
        </Button>
      </div>
    </>
  );
}

export default Login;
