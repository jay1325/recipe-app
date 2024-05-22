"use client";
import {auth} from "../../firebase"
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignIn() {
  
    const router = useRouter();


  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        router.push("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(errorMessage);
      });
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "80vh" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="fs-3 my-3 text-center">Sign In</div>
        <div class="mb-3">
          <label htmlFor="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div class="mb-3">
          <label htmlFor="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            class="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
        <div className="my-3">
            <Link href={"/signup"}>New User? Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
