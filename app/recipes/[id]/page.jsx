"use client";

import { storage, db, auth } from "./../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc,doc, getDocs,getDoc, collection, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecipeDetails({params}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setfile] = useState(null);

  useEffect(()=>{
    const getRecipeDetails = async ( ) => {
        const recipe = await getDoc(doc(db,"recipes",params.id));
        const data = recipe.data();
        setTitle(data.title);
        setIngredients(data.ingredients);
        setInstructions(data.setInstructions)

    }
    getRecipeDetails();
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipe = doc(db,"recipes",params.id);
    await updateDoc(recipe,{
        title:title,
        ingredients:ingredients,
        instructions: instructions,
    })
    router.push("/")
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "80vh" }}
    >
      <form onSubmit={handleSubmit}>
        <h1 className="mb-3 text-center">View/Update Recipe</h1>
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
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}
