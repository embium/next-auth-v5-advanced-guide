import Link from 'next/link';

interface SmallEntityProps {
  key: string;
  id: string;
  title: string;
  body: string;
}

export default function SmallEntity({
  key,
  id,
  title,
  body,
}: SmallEntityProps) {
  return (
    <Link href={`/entity/${id}`}>
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm">{body}</p>
      </div>
    </Link>
  );
}
