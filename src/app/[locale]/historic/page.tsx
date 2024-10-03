'use client';
import { NavigateBefore } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Historic() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="absolute top-4 left-4">
        <button
          className="p-4 rounded-full text-textSecondary hover:cursor-pointer"
          aria-label="Back"
          onClick={() => router.push('/')}
        >
          <NavigateBefore fontSize="large" />
        </button>
      </div>
      <h1>historic</h1>
    </div>
  );
}
