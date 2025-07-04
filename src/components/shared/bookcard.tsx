// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
export default function BookCard({ book }) {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header avec titre */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {book.title}
        </h2>
        <div className="w-12 h-0.5 bg-blue-500 rounded-full"></div>
      </div>

      {/* Informations du livre */}
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Auteur</span>
          <span className="ml-3 text-gray-800 font-medium">{book.author}</span>
        </div>

        {/* Prix avec style moderne */}
        {book.price && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Prix</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                {book.price.amount}
              </span>
              <span className="text-sm text-gray-600 ml-1">
                {book.price.currency}
              </span>
              {book.price.includes_taxes && (
                <span className="block text-xs text-gray-500 italic">TTC</span>
              )}
            </div>
          </div>
        )}

        {/* Note avec étoiles */}
        {book.averageRating && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Note</span>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(book.averageRating) ? 'text-yellow-400' : 'text-gray-200'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-700">
                {book.averageRating}/5
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Accent décoratif */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-blue-50 rounded-bl-2xl rounded-tr-2xl"></div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
  );
}