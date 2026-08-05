import Navigation from "@components/Navigation";

export function Welcome() {
  return (
    <div>
      <Navigation />

      <main>
        <div className="text-8xl m-5 mt-30 text-center">
          Dropbox Photo Manager
        </div>
      </main>
    </div>
  );
}
