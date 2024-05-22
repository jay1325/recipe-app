"use client";

import Link from "next/link";
import RecipeCard from "./components/RecipeCard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const [recipesList, setRecipesList] = useState([]);

  useEffect(() => {
    const getRecipeList = async () => {
      const recipesCollection = collection(db, "recipes");
      const recipeSnapshot = await getDocs(recipesCollection);
      const recipes = recipeSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecipesList(recipes);
    };
    getRecipeList();
  }, []);

  return (
    <main className="my-3 container">
      <div className="d-flex justify-content-between ">
        <h4>Recipes List</h4>
        <Link href={"/recipes/create"} className="btn btn-primary">
          Add new Recipe
        </Link>
      </div>
      <div className="d-flex flex-wrap">
        {recipesList.map((item) => {
          return item.imageUrl ? <RecipeCard props={item}></RecipeCard> : null;
        })}
      </div>
    </main>
  );
}
