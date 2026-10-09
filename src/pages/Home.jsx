function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-blue-50 px-4 text-center">
      <h1 className="text-3xl font-bold sm:text-5xl">
        Welcome to <span className="text-blue-600">Uniqueco</span> Task Manager
      </h1>
      <p className="mt-3 text-base text-gray-600 sm:text-lg">
        Plan your work. Finish your tasks.
      </p>
    </div>
  );
}

export default Home;