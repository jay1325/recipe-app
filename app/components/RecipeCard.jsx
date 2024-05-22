import Image from "next/image";
import Link from "next/link";
export default function RecipeCard({ props }) {
  return (
    <div className="me-3 mt-3">
      <Link className="text-decoration-none" href={"/recipes/" + props.id}>
        <div className="card" style={{ width: "18rem" }}>
          <Image
            width={250}
            height={250}
            src={props.imageUrl}
            class="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text overflow-y-auto" style={{"height":"150px"}}>
              {props.instructions}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
