import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export default function Rating({ rating, size = 'md', showNumber = false, reviewCount }: RatingProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`${textSize[size]} font-medium text-gray-600 dark:text-gray-400 ml-1`}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && <span className="text-gray-400"> ({reviewCount})</span>}
        </span>
      )}
    </div>
  );
}
