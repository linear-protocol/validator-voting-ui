export default function Footer() {
  return (
    <footer className="flex flex-col mx-auto py-10">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} LiNEAR DAO. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
