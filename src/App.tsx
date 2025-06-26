import "./App.css";
import { useQuery } from "@tanstack/react-query";

const fetchName = async (): Promise<{ name: string }> => {
  const res = await fetch("/api/");
  if (!res.ok) {
    throw new Error("failed to fetch name");
  }
  return res.json();
};

function App() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["name"],
    queryFn: fetchName,
    enabled: false,
  });

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <button onClick={() => refetch()} aria-label="get name">
          Name from API is:{" "}
          {isLoading ? "Loading..." : (data?.name ?? "unknown")}
        </button>
        {error && (
          <p style={{ color: "red" }}>Error: {(error as Error).message}</p>
        )}
      </div>
    </>
  );
}

export default App;
