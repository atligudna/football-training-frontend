export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-100 p-6">
      <h2 className="mb-8 text-2xl font-bold">
        ⚽ Planner
      </h2>

      <nav className="space-y-3">
        <div>Dashboard</div>
        <div>Sessions</div>
        <div>Drills</div>
        <div>Categories</div>
        <div>Fields</div>
        <div>Equipment</div>
        <div>Analytics</div>
      </nav>
    </aside>
  );
}