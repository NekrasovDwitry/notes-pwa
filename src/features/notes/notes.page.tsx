import {href, Link} from "react-router-dom";
import {ROUTES} from "@/shared/model/routes.tsx";

function NotesPage() {
  return (
      <div>
        <h1>Notes Page</h1>
        <Link to={href(ROUTES.NOTE, {noteId: "1"})}>Note 1</Link>
      </div>
  );
}

export const Component = NotesPage;
