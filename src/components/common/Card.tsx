import React from "react";

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  className,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-colors duration-200 ${className}`}
    >
      {imageUrl && <img src={imageUrl} alt={title} className="rounded-t-lg" />}
      <h2 className="text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mt-1">{description}</p>
    </div>
  );
};

export default Card;
