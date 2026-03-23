export default function Agents() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {["Task Agent", "Reminder Agent", "Escalation Agent"].map((a) => (
        <div key={a} className="p-4 border rounded-xl">
          <h3>{a}</h3>
          <p className="text-green-500">Active</p>
        </div>
      ))}
    </div>
  );
}