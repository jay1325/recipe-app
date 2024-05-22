"use client";

import { useState } from "react";
import { storage, db, auth } from "./../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreateRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const generateRecipeID = async () => {
    const recipesSnapshot = await getDocs(collection(db, "recipes"));
    const recipeCount = recipesSnapshot.size;
    return recipeCount + 1; // Next sequential ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File available at", downloadURL);

        try {
          const recipeID = await generateRecipeID();
          
          const recipeDocRef = doc(collection(db, "recipes"));
          const recipeDocID = recipeDocRef.id;

          // Add document to recipes collection
          await setDoc(recipeDocRef, {
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            imageUrl: downloadURL,
            userId: auth.currentUser.uid,
          });

          // Add document to RecipeID collection with the same ID
          const recipeIDDocRef = doc(db, "RecipeID", recipeDocID);
          await setDoc(recipeIDDocRef, {
            RecipeId: recipeID,
          });

          setTitle("");
          setIngredients("");
          setInstructions("");
          setFile(null);

          router.push("/");
        } catch (e) {
          alert("Something went wrong", e);
        }
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
            placeholder="Title"
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients"
            rows={5}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions"
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
