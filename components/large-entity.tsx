import Link from 'next/link';

interface LargeEntityProps {
  key: string;
  id: string;
  title: string;
  body: string;
  rating: number;
}

export default async function LargeEntity({
  key,
  id,
  title,
  body,
  rating,
}: LargeEntityProps) {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm">{body}</p>
      <p className="text-sm">{rating} / 5</p>
    </div>
  );
}
