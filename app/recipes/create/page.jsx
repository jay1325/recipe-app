"use client";

import { useEffect, useState } from "react";
import { storage, db, auth } from "./../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc,getDocs, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreateRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setfile] = useState(null);

  const handleImageUpload = (e) => {
    setfile(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);

          const recipesCollection = collection(db, "recipes");
          const recipesSnapshot = await getDocs(recipesCollection);
          try {
            await addDoc(recipesCollection, {
              title: title,
              ingredients: ingredients,
              instructions: instructions,
              imageUrl: downloadURL,
              userId: auth.currentUser.uid,
            });
          } catch (e) {
            alert("Something went wrong", e);
          }
          setTitle("");
          setIngredients("");
          setInstructions("");
          setfile(null);

          router.push("/")
        });
      }
    );
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "80vh" }}
    >
      <form onSubmit={handleSubmit}>
        <h1 className="mb-3 text-center">Create Recipe</h1>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="ingredients"
            rows={5}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="instructions"
            rows={5}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleImageUpload}
            required
          />
        </div>

        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}
