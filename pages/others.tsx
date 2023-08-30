import { useRouter } from "next/router";
import { Landing, Questions } from ".";
import { sermons } from "@/data";

export default function Others() {
  const { query } = useRouter();
  const { step } = query;

  function getStep() {
    switch (step) {
      case "1":
        return <Questions data={sermons} />;
      default:
        return <Landing data={sermons} />;
    }
  }

  return <main className="py-10">{getStep()}</main>;
}
