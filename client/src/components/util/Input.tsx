import { ReactNode, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface InputProps {
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  children?: ReactNode;
}

export function TextInput({
  placeholder,
  value,
  setValue,
  children,
}: InputProps) {
  return (
    <>
      <div className="flex flex-col">
        <input
          type="text"
          className="border-accent text-text h-10 w-48 border-b-2 bg-transparent p-2 text-base
                      focus:outline-0 sm:h-12 sm:w-64 sm:text-lg md:h-14 md:w-72 md:text-xl"
          value={value ?? ""}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
        {children}
      </div>
    </>
  );
}

export function PasswordInput({
  placeholder,
  value,
  setValue,
  children,
}: InputProps) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="relative flex flex-col ">
        <input
          type={show ? "text" : "password"}
          className="border-accent text-text h-10 w-48 border-b-2 bg-transparent p-2 pr-10
                        text-base focus:outline-0 sm:h-12 sm:w-64 sm:text-lg md:h-14 md:w-72 md:text-xl"
          value={value ?? ""}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
        <div
          className="text-text absolute right-0 top-0 flex h-10 cursor-pointer items-center justify-center pr-1 sm:h-12 sm:pr-2 md:h-14"
          onClick={() => setShow(!show)}
        >
          {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </div>
        {children}
      </div>
    </>
  );
}
