export function TwoPane({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <div className="w-1/2 outline outline-2 outline-blue-300">{left}</div>
      <div className="w-1/2 outline outline-2 outline-blue-300">{right}</div>
    </div>
  );
}
