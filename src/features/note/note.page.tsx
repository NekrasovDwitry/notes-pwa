import {useParams} from "react-router-dom";
import {ROUTES, type PathParams} from "@/shared/model/routes.tsx";

function NotePage() {
  const params = useParams<PathParams[typeof ROUTES.NOTE]>();

  return (
      <div>
        Board Page {params.noteId}
      </div>
  );
}

export const Component = NotePage;
